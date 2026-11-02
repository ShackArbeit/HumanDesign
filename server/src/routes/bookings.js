// 預約 API：建立預約、取消預約、查看自己的預約
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { paymentInfo } from '../config/paymentInfo.js';
import { CANCEL_CUTOFF_HOURS, defaultScheduleRules as rules } from '../config/scheduleRules.js';
import { findService } from '../config/services.js';
import { getLocalDate, getSlotLocks, validateBookingTime } from '../lib/availability.js';
import {
  cancelBookingWithLocks,
  createBookingWithLocks,
  listBookingsByUser,
  listClosures,
} from '../lib/database.js';
import { AppError, forbidden, notFound, unauthenticated } from '../lib/errors.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { noStore } from '../middleware/cache.js';
import { createBookingRateLimit } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { bookingParams, cancelBookingQuery, createBookingBody } from '../schemas/bookings.js';

const ONE_MINUTE_MS = 60 * 1000;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;

const TIME_ERROR_MESSAGES = {
  TOO_SOON: '此時段已超過可預約期限，請至少提前 3 天預約',
  TOO_FAR: '此時段尚未開放預約',
  OUTSIDE_BUSINESS_HOURS: '此時段不在服務時間內',
};

// 把 token 轉成 hash，資料庫外洩時也無法還原出原本的 token
function hashToken(token) {
  return createHash('sha256').update(token).digest();
}

// 比對訪客提供的取消 token 是否正確
function isValidCancelToken(token, storedHash) {
  if (!token || !storedHash) {
    return false;
  }
  return timingSafeEqual(hashToken(token), Buffer.from(storedHash, 'hex'));
}

// 只挑選可以給瀏覽器看的欄位，避免洩漏 cancelTokenHash 等內部資料
function toPublicBooking(booking) {
  return {
    id: booking.id,
    serviceId: booking.serviceId,
    durationMin: booking.durationMin,
    priceTwd: booking.priceTwd,
    startAt: booking.startAt.toISOString(),
    endAt: booking.endAt.toISOString(),
    status: booking.status,
    note: booking.note || null,
    createdAt: booking.createdAt.toISOString(),
  };
}

// 找出服務對應的時長方案，沒有這個時長就回傳 400
function findServiceOption(service, durationMin) {
  const option = service.options.find((item) => item.durationMin === durationMin);
  if (!option) {
    throw new AppError(400, 'VALIDATION_ERROR', '此服務沒有這個時長', [
      { path: 'durationMin', message: '此服務沒有這個時長' },
    ]);
  }
  return option;
}

// 檢查時間是否可預約，不行就回傳 422
async function checkBookingTime(startAt, durationMin, currentTime) {
  const date = getLocalDate(startAt, rules.timezone);
  const closures = await listClosures(date, date);
  const errorCode = validateBookingTime({
    rules,
    closures,
    startAt,
    durationMin,
    now: currentTime,
  });
  if (errorCode) {
    throw new AppError(422, errorCode, TIME_ERROR_MESSAGES[errorCode]);
  }
}

// 走到這裡時預約已經存好了，所以寄信失敗不能讓整個請求失敗
async function sendConfirmationEmail(mail, emailData, bookingId) {
  try {
    const result = await mail.sendBookingConfirmation(emailData);
    return result !== false;
  } catch (error) {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: 'Confirmation email failed',
        bookingId,
        error: error.message,
      }),
    );
    return false;
  }
}

// mail 和 now 由外部傳入，測試時可以換成假的寄信功能和固定時間
export function createBookingsRouter({ mail, now, webBaseUrl, rateLimitMax }) {
  const router = Router();

  // 建立預約：會員和訪客都走這裡
  router.post(
    '/bookings',
    noStore,
    createBookingRateLimit(rateLimitMax),
    optionalAuth,
    validate({ body: createBookingBody }),
    async (req, res) => {
      const input = req.validated.body;
      const user = req.user;
      const currentTime = now();

      if (!user && !input.guestEmail) {
        throw new AppError(400, 'VALIDATION_ERROR', '未登入時需填寫 Email', [
          { path: 'guestEmail', message: '未登入時需填寫 Email' },
        ]);
      }

      // 第 1 步：確認服務和時長都存在，價格一律用後端的資料
      const service = findService(input.serviceId);
      if (!service) {
        throw notFound('找不到此服務');
      }
      const option = findServiceOption(service, input.durationMin);

      // 第 2 步：確認時間在可預約範圍內
      const startAt = new Date(input.startAt);
      await checkBookingTime(startAt, option.durationMin, currentTime);

      // 第 3 步：訪客用取消 token 取消預約，資料庫只存 hash，不存原始 token
      let cancelToken = null;
      let cancelTokenHash = null;
      if (!user) {
        cancelToken = randomBytes(32).toString('hex');
        cancelTokenHash = hashToken(cancelToken).toString('hex');
      }

      const booking = {
        userId: user ? user.uid : null,
        guestEmail: user ? null : input.guestEmail,
        serviceId: service.id,
        durationMin: option.durationMin,
        priceTwd: option.priceTwd,
        startAt,
        endAt: new Date(startAt.getTime() + option.durationMin * ONE_MINUTE_MS),
        status: 'pending_payment',
        note: input.note || null,
        cancelTokenHash,
      };

      // 第 4 步：在 transaction 內寫入預約和時段鎖，時段已被預約時會回 409
      const locks = getSlotLocks({ rules, startAt, durationMin: option.durationMin });
      const bookingId = await createBookingWithLocks(booking, locks, currentTime);

      booking.id = bookingId;
      booking.createdAt = currentTime;

      // 第 5 步：寄確認信，訪客的信裡會附取消連結
      let cancelUrl = null;
      if (cancelToken) {
        cancelUrl = `${webBaseUrl}/bookings/${bookingId}/cancel?token=${cancelToken}`;
      }

      const emailSent = await sendConfirmationEmail(
        mail,
        {
          to: user ? user.email : input.guestEmail,
          booking,
          serviceName: service.name,
          timezone: rules.timezone,
          cancelUrl,
        },
        bookingId,
      );

      // 第 6 步：回傳結果給前端
      const data = toPublicBooking(booking);
      data.emailSent = emailSent;
      data.paymentInfo = paymentInfo;
      if (cancelToken) {
        data.cancelToken = cancelToken;
      }
      res.status(201).json({ data });
    },
  );

  // 取消預約：會員要是本人，訪客要有正確的取消 token
  router.delete(
    '/bookings/:id',
    noStore,
    optionalAuth,
    validate({ params: bookingParams, query: cancelBookingQuery }),
    async (req, res) => {
      const user = req.user;
      const token = req.validated.query.token;
      const currentTime = now();

      // 這個檢查會在 transaction 內執行，不符合時丟出錯誤
      function checkCanCancel(booking) {
        if (booking.userId) {
          if (!user) throw unauthenticated();
          if (booking.userId !== user.uid) throw forbidden();
        } else if (!isValidCancelToken(token, booking.cancelTokenHash)) {
          throw forbidden();
        }

        const msLeft = booking.startAt.getTime() - currentTime.getTime();
        const hoursLeft = msLeft / ONE_HOUR_MS;
        if (hoursLeft < CANCEL_CUTOFF_HOURS) {
          throw new AppError(
            422,
            'TOO_LATE_TO_CANCEL',
            `預約開始前 ${CANCEL_CUTOFF_HOURS} 小時內無法取消`,
          );
        }
      }

      const booking = await cancelBookingWithLocks(
        req.validated.params.id,
        checkCanCancel,
        currentTime,
      );
      res.json({ data: toPublicBooking(booking) });
    },
  );

  // 查看自己的預約：一定要登入
  router.get('/me/bookings', noStore, requireAuth, async (req, res) => {
    const bookings = await listBookingsByUser(req.user.uid);

    const data = [];
    for (const booking of bookings) {
      data.push(toPublicBooking(booking));
    }
    res.json({ data });
  });

  return router;
}
