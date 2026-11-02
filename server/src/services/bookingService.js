import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { paymentInfo } from '../config/paymentInfo.js';
import { CANCEL_CUTOFF_HOURS } from '../config/scheduleRules.js';
import { AppError, forbidden, notFound, unauthenticated } from '../lib/errors.js';
import { cancelWithLocks, createWithLocks } from '../repositories/bookingRepository.js';
import { getService } from '../repositories/catalogRepository.js';
import { getScheduleRules, listClosures } from '../repositories/scheduleRepository.js';
import { getLocalDate, getSlotLocks, validateBookingTime } from './availabilityService.js';

const ONE_MINUTE_MS = 60 * 1000;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;

const TIME_ERROR_MESSAGES = {
  TOO_SOON: '此時段已超過可預約期限，請至少提前 3 天預約',
  TOO_FAR: '此時段尚未開放預約',
  OUTSIDE_BUSINESS_HOURS: '此時段不在服務時間內',
};

function hashToken(token) {
  return createHash('sha256').update(token).digest();
}

function isValidCancelToken(token, storedHash) {
  if (!token || !storedHash) {
    return false;
  }
  return timingSafeEqual(hashToken(token), Buffer.from(storedHash, 'hex'));
}

// Only these fields may be sent to the browser.
export function toPublicBooking(booking) {
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

function findServiceOption(service, durationMin) {
  const option = service.options.find((item) => item.durationMin === durationMin);
  if (!option) {
    throw new AppError(400, 'VALIDATION_ERROR', '此服務沒有這個時長', [
      { path: 'durationMin', message: '此服務沒有這個時長' },
    ]);
  }
  return option;
}

async function checkBookingTime(rules, startAt, durationMin, currentTime) {
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

// mail, now and webBaseUrl are passed in so tests can use a fake clock and fake mailer.
export function createBookingService({ mail, now, webBaseUrl }) {
  async function sendConfirmation(emailData, bookingId) {
    try {
      const result = await mail.sendBookingConfirmation(emailData);
      return result !== false;
    } catch (error) {
      // The booking is already saved, so a mail problem must not fail the request.
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

  async function create({ input, user }) {
    const currentTime = now();

    const service = await getService(input.serviceId);
    if (!service || !service.active) {
      throw notFound('找不到此服務');
    }
    const option = findServiceOption(service, input.durationMin);

    const rules = await getScheduleRules();
    const startAt = new Date(input.startAt);
    await checkBookingTime(rules, startAt, option.durationMin, currentTime);

    // Guests cancel with a token. Only its hash is stored in the database.
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

    const locks = getSlotLocks({ rules, startAt, durationMin: option.durationMin });
    const bookingId = await createWithLocks(booking, locks, currentTime);

    booking.id = bookingId;
    booking.createdAt = currentTime;

    let cancelUrl = null;
    if (cancelToken) {
      cancelUrl = `${webBaseUrl}/bookings/${bookingId}/cancel?token=${cancelToken}`;
    }

    const emailSent = await sendConfirmation(
      {
        to: user ? user.email : input.guestEmail,
        booking,
        serviceName: service.name,
        timezone: rules.timezone,
        cancelUrl,
      },
      bookingId,
    );

    const result = toPublicBooking(booking);
    result.emailSent = emailSent;
    result.paymentInfo = paymentInfo;
    if (cancelToken) {
      result.cancelToken = cancelToken;
    }
    return result;
  }

  async function cancel({ id, user, token }) {
    const currentTime = now();

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

    const booking = await cancelWithLocks(id, checkCanCancel, currentTime);
    return toPublicBooking(booking);
  }

  return { create, cancel };
}
