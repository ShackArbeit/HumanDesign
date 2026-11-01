import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const toMinutes = (hhmm) => {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return hours * 60 + minutes;
};

const toMinuteRanges = (ranges) =>
  ranges.map(({ start, end }) => ({ start: toMinutes(start), end: toMinutes(end) }));

const addDays = (date, days) => dayjs.utc(date).add(days, 'day').format('YYYY-MM-DD');

const toIso = (ms) => new Date(ms).toISOString().replace('.000Z', 'Z');

const subtractRange = (ranges, closed) =>
  ranges.flatMap((range) => {
    if (closed.end <= range.start || closed.start >= range.end) return [range];
    const parts = [];
    if (closed.start > range.start) parts.push({ start: range.start, end: closed.start });
    if (closed.end < range.end) parts.push({ start: closed.end, end: range.end });
    return parts;
  });

const getOpenRanges = (rules, date, closure) => {
  const weekday = WEEKDAY_KEYS[dayjs.utc(date).day()];
  const weekly = toMinuteRanges(rules.weekly[weekday] ?? []);
  if (!closure) return weekly;
  if (closure.ranges == null) return [];
  return toMinuteRanges(closure.ranges).reduce(subtractRange, weekly);
};

// Every day shares one row set so the week table can line its rows up.
const getGridBounds = (rules) => {
  const ranges = toMinuteRanges(Object.values(rules.weekly).flat());
  if (ranges.length === 0) return { start: 0, end: 0 };
  return {
    start: Math.min(...ranges.map((range) => range.start)),
    end: Math.max(...ranges.map((range) => range.end)),
  };
};

const getBlockedIntervals = (bookings, bufferMinutes) =>
  bookings
    .filter((booking) => booking.status !== 'cancelled')
    .map((booking) => ({
      start: new Date(booking.startAt).getTime(),
      end: new Date(booking.endAt).getTime() + bufferMinutes * MINUTE_MS,
    }));

const overlapsAny = (start, end, intervals) =>
  intervals.some((interval) => start < interval.end && end > interval.start);

const findContainingRange = (ranges, start, end) =>
  ranges.find((range) => start >= range.start && end <= range.end);

const getBookingWindow = (rules, nowMs) => ({
  earliestMs: nowMs + rules.minLeadDays * DAY_MS,
  lastDate: addDays(dayjs(nowMs).tz(rules.timezone).format('YYYY-MM-DD'), rules.maxAdvanceDays),
});

const getSlotStatus = ({ rules, date, minute, startMs, openRanges, blocked, now, durationMin }) => {
  const { slotMinutes, bufferMinutes } = rules;
  const endMs = startMs + slotMinutes * MINUTE_MS;
  const window = getBookingWindow(rules, now);

  if (startMs <= now) return 'past';

  const range = findContainingRange(openRanges, minute, minute + slotMinutes);
  if (!range || date > window.lastDate) return 'closed';
  if (startMs < window.earliestMs) return 'too_soon';
  if (overlapsAny(startMs, endMs, blocked)) return 'booked';

  if (durationMin) {
    // The session must fit business hours; only its buffer may run past closing.
    if (minute + durationMin > range.end) return 'closed';
    const blockedUntil = startMs + (durationMin + bufferMinutes) * MINUTE_MS;
    if (overlapsAny(startMs, blockedUntil, blocked)) return 'booked';
  }
  return 'available';
};

export function computeAvailability({
  rules,
  closures = [],
  bookings = [],
  from,
  to,
  now,
  durationMin,
}) {
  const nowMs = new Date(now).getTime();
  const closureByDate = new Map(closures.map((closure) => [closure.date, closure]));
  const blocked = getBlockedIntervals(bookings, rules.bufferMinutes);
  const grid = getGridBounds(rules);
  const days = [];

  for (let date = from; date <= to; date = addDays(date, 1)) {
    const closure = closureByDate.get(date);
    const openRanges = getOpenRanges(rules, date, closure);
    const dayStartMs = dayjs.tz(`${date} 00:00`, rules.timezone).valueOf();
    const slots = [];

    for (let minute = grid.start; minute < grid.end; minute += rules.slotMinutes) {
      const startMs = dayStartMs + minute * MINUTE_MS;
      slots.push({
        start: toIso(startMs),
        end: toIso(startMs + rules.slotMinutes * MINUTE_MS),
        status: getSlotStatus({
          rules,
          date,
          minute,
          startMs,
          openRanges,
          blocked,
          now: nowMs,
          durationMin,
        }),
      });
    }

    days.push({
      date,
      weekday: dayjs.utc(date).day(),
      closedReason: closure?.reason ?? null,
      slots,
    });
  }

  return {
    timezone: rules.timezone,
    slotMinutes: rules.slotMinutes,
    maxAdvanceDays: rules.maxAdvanceDays,
    days,
  };
}

// Returns the error code that rejects this start time, or null when it is bookable.
export function validateBookingTime({ rules, closures = [], startAt, durationMin, now }) {
  const startMs = new Date(startAt).getTime();
  const nowMs = new Date(now).getTime();
  const local = dayjs(startMs).tz(rules.timezone);
  const date = local.format('YYYY-MM-DD');
  const minute = local.hour() * 60 + local.minute();
  const window = getBookingWindow(rules, nowMs);

  if (startMs < window.earliestMs) return 'TOO_SOON';
  if (date > window.lastDate) return 'TOO_FAR';

  const closure = closures.find((item) => item.date === date);
  const openRanges = getOpenRanges(rules, date, closure);
  const onGrid = minute % rules.slotMinutes === 0 && local.second() === 0;
  if (!onGrid || !findContainingRange(openRanges, minute, minute + durationMin)) {
    return 'OUTSIDE_BUSINESS_HOURS';
  }
  return null;
}

// Lock ids cover the session plus buffer, so two overlapping bookings always
// collide on at least one document inside the Firestore transaction.
export function getSlotLocks({ rules, startAt, durationMin }) {
  const startMs = new Date(startAt).getTime();
  const totalMinutes = durationMin + rules.bufferMinutes;
  const locks = [];

  for (let offset = 0; offset < totalMinutes; offset += rules.slotMinutes) {
    const lockMs = startMs + offset * MINUTE_MS;
    locks.push({
      id: dayjs(lockMs).tz(rules.timezone).format('YYYYMMDD-HHmm'),
      startAt: new Date(lockMs),
    });
  }
  return locks;
}

export const getDayRange = (from, to, timezoneName) => ({
  startMs: dayjs.tz(`${from} 00:00`, timezoneName).valueOf(),
  endMs: dayjs.tz(`${addDays(to, 1)} 00:00`, timezoneName).valueOf(),
});

export const getLocalDate = (value, timezoneName) =>
  dayjs(value).tz(timezoneName).format('YYYY-MM-DD');
