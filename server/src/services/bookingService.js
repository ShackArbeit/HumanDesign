import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { CANCEL_CUTOFF_HOURS } from '../config/scheduleRules.js';
import { AppError, forbidden, notFound, unauthenticated } from '../lib/errors.js';
import * as bookingRepository from '../repositories/bookingRepository.js';
import { getService } from '../repositories/catalogRepository.js';
import { getScheduleRules, listClosures } from '../repositories/scheduleRepository.js';
import { getLocalDate, getSlotLocks, validateBookingTime } from './availabilityService.js';

const TIME_ERROR_MESSAGES = {
  TOO_SOON: '此時段已超過可預約期限，請至少提前 3 天預約',
  TOO_FAR: '此時段尚未開放預約',
  OUTSIDE_BUSINESS_HOURS: '此時段不在服務時間內',
};

const hashToken = (token) => createHash('sha256').update(token).digest();

const tokenMatches = (token, storedHash) => {
  if (!token || !storedHash) return false;
  return timingSafeEqual(hashToken(token), Buffer.from(storedHash, 'hex'));
};

export const toPublicBooking = (booking) => ({
  id: booking.id,
  serviceId: booking.serviceId,
  durationMin: booking.durationMin,
  priceTwd: booking.priceTwd,
  startAt: booking.startAt.toISOString(),
  endAt: booking.endAt.toISOString(),
  status: booking.status,
  note: booking.note ?? null,
  createdAt: booking.createdAt.toISOString(),
});

export const createBookingService = ({ mail, now, webBaseUrl }) => {
  const sendConfirmation = async ({ booking, service, rules, to, cancelUrl }) => {
    try {
      await mail.sendBookingConfirmation({
        to,
        booking,
        serviceName: service.name,
        timezone: rules.timezone,
        cancelUrl,
      });
    } catch (error) {
      // The booking is already committed, so a mail outage must not fail the request.
      console.error(
        JSON.stringify({
          severity: 'ERROR',
          message: 'Confirmation email failed',
          bookingId: booking.id,
          error: error.message,
        }),
      );
    }
  };

  const create = async ({ input, user }) => {
    const currentTime = now();
    const service = await getService(input.serviceId);
    if (!service?.active) throw notFound('找不到此服務');

    const option = service.options.find((item) => item.durationMin === input.durationMin);
    if (!option) {
      throw new AppError(400, 'VALIDATION_ERROR', '此服務沒有這個時長', [
        { path: 'durationMin', message: '此服務沒有這個時長' },
      ]);
    }

    const rules = await getScheduleRules();
    const startAt = new Date(input.startAt);
    const date = getLocalDate(startAt, rules.timezone);
    const closures = await listClosures(date, date);
    const timeError = validateBookingTime({
      rules,
      closures,
      startAt,
      durationMin: option.durationMin,
      now: currentTime,
    });
    if (timeError) throw new AppError(422, timeError, TIME_ERROR_MESSAGES[timeError]);

    const cancelToken = user ? null : randomBytes(32).toString('hex');
    const booking = {
      userId: user?.uid ?? null,
      guestEmail: user ? null : input.guestEmail,
      serviceId: service.id,
      durationMin: option.durationMin,
      priceTwd: option.priceTwd,
      startAt,
      endAt: new Date(startAt.getTime() + option.durationMin * 60 * 1000),
      status: 'pending_payment',
      note: input.note ?? null,
      cancelTokenHash: cancelToken ? hashToken(cancelToken).toString('hex') : null,
    };
    const locks = getSlotLocks({ rules, startAt, durationMin: option.durationMin });
    const id = await bookingRepository.createWithLocks(booking, locks, currentTime);
    const saved = { ...booking, id, createdAt: currentTime };

    await sendConfirmation({
      booking: saved,
      service,
      rules,
      to: user?.email ?? input.guestEmail,
      cancelUrl: cancelToken
        ? `${webBaseUrl}/bookings/${id}/cancel?token=${cancelToken}`
        : null,
    });

    return { ...toPublicBooking(saved), ...(cancelToken ? { cancelToken } : {}) };
  };

  const cancel = async ({ id, user, token }) => {
    const currentTime = now();
    const authorize = (booking) => {
      if (booking.userId) {
        if (!user) throw unauthenticated();
        if (booking.userId !== user.uid) throw forbidden();
      } else if (!tokenMatches(token, booking.cancelTokenHash)) {
        throw forbidden();
      }
      const hoursLeft = (booking.startAt.getTime() - currentTime.getTime()) / (60 * 60 * 1000);
      if (hoursLeft < CANCEL_CUTOFF_HOURS) {
        throw new AppError(
          422,
          'TOO_LATE_TO_CANCEL',
          `預約開始前 ${CANCEL_CUTOFF_HOURS} 小時內無法取消`,
        );
      }
    };
    const booking = await bookingRepository.cancelWithLocks(id, authorize, currentTime);
    return toPublicBooking(booking);
  };

  return { create, cancel };
};
