import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const ONE_MINUTE_MS = 60 * 1000;
const ONE_DAY_MS = 24 * 60 * ONE_MINUTE_MS;
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// '10:30' -> 630
function timeToMinutes(time) {
  const parts = time.split(':');
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  return hours * 60 + minutes;
}

function rangesToMinutes(ranges) {
  const result = [];
  for (const range of ranges) {
    result.push({ start: timeToMinutes(range.start), end: timeToMinutes(range.end) });
  }
  return result;
}

function addDays(date, days) {
  return dayjs.utc(date).add(days, 'day').format('YYYY-MM-DD');
}

function toIsoString(ms) {
  return new Date(ms).toISOString().replace('.000Z', 'Z');
}

function removeClosedRange(openRanges, closedRange) {
  const result = [];
  for (const range of openRanges) {
    const noOverlap = closedRange.end <= range.start || closedRange.start >= range.end;
    if (noOverlap) {
      result.push(range);
      continue;
    }
    if (closedRange.start > range.start) {
      result.push({ start: range.start, end: closedRange.start });
    }
    if (closedRange.end < range.end) {
      result.push({ start: closedRange.end, end: range.end });
    }
  }
  return result;
}

function getOpenRanges(rules, date, closure) {
  const weekdayKey = WEEKDAY_KEYS[dayjs.utc(date).day()];
  const weeklyRanges = rules.weekly[weekdayKey] || [];
  let openRanges = rangesToMinutes(weeklyRanges);

  if (!closure) {
    return openRanges;
  }
  // ranges is null when the whole day is closed
  if (closure.ranges === null || closure.ranges === undefined) {
    return [];
  }

  const closedRanges = rangesToMinutes(closure.ranges);
  for (const closedRange of closedRanges) {
    openRanges = removeClosedRange(openRanges, closedRange);
  }
  return openRanges;
}

// Every day uses the same rows so the week table can line up.
function getGridBounds(rules) {
  let start = null;
  let end = null;

  for (const dayRanges of Object.values(rules.weekly)) {
    for (const range of rangesToMinutes(dayRanges)) {
      if (start === null || range.start < start) start = range.start;
      if (end === null || range.end > end) end = range.end;
    }
  }

  if (start === null) {
    return { start: 0, end: 0 };
  }
  return { start, end };
}

function getBlockedTimes(bookings, bufferMinutes) {
  const blockedTimes = [];
  for (const booking of bookings) {
    if (booking.status === 'cancelled') continue;
    blockedTimes.push({
      start: new Date(booking.startAt).getTime(),
      end: new Date(booking.endAt).getTime() + bufferMinutes * ONE_MINUTE_MS,
    });
  }
  return blockedTimes;
}

function isBlocked(startMs, endMs, blockedTimes) {
  for (const blocked of blockedTimes) {
    if (startMs < blocked.end && endMs > blocked.start) {
      return true;
    }
  }
  return false;
}

function findRange(openRanges, startMinute, endMinute) {
  for (const range of openRanges) {
    if (startMinute >= range.start && endMinute <= range.end) {
      return range;
    }
  }
  return null;
}

function getEarliestBookableMs(rules, nowMs) {
  return nowMs + rules.minLeadDays * ONE_DAY_MS;
}

function getLastBookableDate(rules, nowMs) {
  const today = dayjs(nowMs).tz(rules.timezone).format('YYYY-MM-DD');
  return addDays(today, rules.maxAdvanceDays);
}

function getSlotStatus(rules, slot, openRanges, blockedTimes, nowMs, durationMin) {
  const slotEndMs = slot.startMs + rules.slotMinutes * ONE_MINUTE_MS;

  if (slot.startMs <= nowMs) {
    return 'past';
  }

  const range = findRange(openRanges, slot.minute, slot.minute + rules.slotMinutes);
  if (!range || slot.date > getLastBookableDate(rules, nowMs)) {
    return 'closed';
  }

  if (slot.startMs < getEarliestBookableMs(rules, nowMs)) {
    return 'too_soon';
  }

  if (isBlocked(slot.startMs, slotEndMs, blockedTimes)) {
    return 'booked';
  }

  if (durationMin) {
    // The session must end inside business hours, but its buffer may run past closing.
    if (slot.minute + durationMin > range.end) {
      return 'closed';
    }
    const totalMinutes = durationMin + rules.bufferMinutes;
    const blockedUntilMs = slot.startMs + totalMinutes * ONE_MINUTE_MS;
    if (isBlocked(slot.startMs, blockedUntilMs, blockedTimes)) {
      return 'booked';
    }
  }

  return 'available';
}

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
  const blockedTimes = getBlockedTimes(bookings, rules.bufferMinutes);
  const grid = getGridBounds(rules);
  const days = [];

  for (let date = from; date <= to; date = addDays(date, 1)) {
    const closure = closures.find((item) => item.date === date);
    const openRanges = getOpenRanges(rules, date, closure);
    const dayStartMs = dayjs.tz(`${date} 00:00`, rules.timezone).valueOf();
    const slots = [];

    for (let minute = grid.start; minute < grid.end; minute += rules.slotMinutes) {
      const startMs = dayStartMs + minute * ONE_MINUTE_MS;
      const endMs = startMs + rules.slotMinutes * ONE_MINUTE_MS;
      const slot = { date, minute, startMs };

      slots.push({
        start: toIsoString(startMs),
        end: toIsoString(endMs),
        status: getSlotStatus(rules, slot, openRanges, blockedTimes, nowMs, durationMin),
      });
    }

    days.push({
      date,
      weekday: dayjs.utc(date).day(),
      closedReason: closure ? closure.reason : null,
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

// Returns an error code when the time cannot be booked, or null when it can.
export function validateBookingTime({ rules, closures = [], startAt, durationMin, now }) {
  const startMs = new Date(startAt).getTime();
  const nowMs = new Date(now).getTime();
  const localTime = dayjs(startMs).tz(rules.timezone);
  const date = localTime.format('YYYY-MM-DD');
  const minute = localTime.hour() * 60 + localTime.minute();

  if (startMs < getEarliestBookableMs(rules, nowMs)) {
    return 'TOO_SOON';
  }
  if (date > getLastBookableDate(rules, nowMs)) {
    return 'TOO_FAR';
  }

  const closure = closures.find((item) => item.date === date);
  const openRanges = getOpenRanges(rules, date, closure);
  const isOnSlotBoundary = minute % rules.slotMinutes === 0 && localTime.second() === 0;
  const fitsBusinessHours = findRange(openRanges, minute, minute + durationMin) !== null;

  if (!isOnSlotBoundary || !fitsBusinessHours) {
    return 'OUTSIDE_BUSINESS_HOURS';
  }
  return null;
}

// One lock per 30 minutes, covering the session and its buffer.
// Two overlapping bookings always share at least one lock document.
export function getSlotLocks({ rules, startAt, durationMin }) {
  const startMs = new Date(startAt).getTime();
  const totalMinutes = durationMin + rules.bufferMinutes;
  const locks = [];

  for (let offset = 0; offset < totalMinutes; offset += rules.slotMinutes) {
    const lockMs = startMs + offset * ONE_MINUTE_MS;
    locks.push({
      id: dayjs(lockMs).tz(rules.timezone).format('YYYYMMDD-HHmm'),
      startAt: new Date(lockMs),
    });
  }
  return locks;
}

export function getDayRange(from, to, timezoneName) {
  const startMs = dayjs.tz(`${from} 00:00`, timezoneName).valueOf();
  const endMs = dayjs.tz(`${addDays(to, 1)} 00:00`, timezoneName).valueOf();
  return { startMs, endMs };
}

export function getLocalDate(value, timezoneName) {
  return dayjs(value).tz(timezoneName).format('YYYY-MM-DD');
}
