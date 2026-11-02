// 可預約時段的計算。所有營業時間都用台灣時間計算，回傳時轉成 UTC
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const ONE_MINUTE_MS = 60 * 1000;
const ONE_DAY_MS = 24 * 60 * ONE_MINUTE_MS;
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// 把時間字串換成分鐘數，例如 '10:30' 會變成 630
function timeToMinutes(time) {
  const parts = time.split(':');
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  return hours * 60 + minutes;
}

// 把一組營業時段都換成分鐘數
function rangesToMinutes(ranges) {
  const result = [];
  for (const range of ranges) {
    result.push({ start: timeToMinutes(range.start), end: timeToMinutes(range.end) });
  }
  return result;
}

// 日期加幾天，格式維持 YYYY-MM-DD
function addDays(date, days) {
  return dayjs.utc(date).add(days, 'day').format('YYYY-MM-DD');
}

// 轉成 API 回傳用的 UTC 時間字串
function toIsoString(ms) {
  return new Date(ms).toISOString().replace('.000Z', 'Z');
}

// 從營業時段中扣掉休息時段，一段可能被切成前後兩段
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

// 算出某一天實際開放的時段：每週規則扣掉當天的休息設定
function getOpenRanges(rules, date, closure) {
  const weekdayKey = WEEKDAY_KEYS[dayjs.utc(date).day()];
  const weeklyRanges = rules.weekly[weekdayKey] || [];
  let openRanges = rangesToMinutes(weeklyRanges);

  if (!closure) {
    return openRanges;
  }
  // ranges 是 null 代表整天休息
  if (closure.ranges === null || closure.ranges === undefined) {
    return [];
  }

  const closedRanges = rangesToMinutes(closure.ranges);
  for (const closedRange of closedRanges) {
    openRanges = removeClosedRange(openRanges, closedRange);
  }
  return openRanges;
}

// 找出一週中最早和最晚的營業時間，讓每天的列數相同，週曆表格才對得齊
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

// 列出被占用的時間：每筆預約的時間加上 buffer，已取消的不算
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

// 判斷一段時間有沒有跟任何已占用的時間重疊
function isBlocked(startMs, endMs, blockedTimes) {
  for (const blocked of blockedTimes) {
    if (startMs < blocked.end && endMs > blocked.start) {
      return true;
    }
  }
  return false;
}

// 找出能完整包住這段時間的營業時段，找不到回傳 null
function findRange(openRanges, startMinute, endMinute) {
  for (const range of openRanges) {
    if (startMinute >= range.start && endMinute <= range.end) {
      return range;
    }
  }
  return null;
}

// 最早可預約時間：現在加上最少提前天數
function getEarliestBookableMs(rules, nowMs) {
  return nowMs + rules.minLeadDays * ONE_DAY_MS;
}

// 最晚可預約日期：以台灣時間的今天往後算
function getLastBookableDate(rules, nowMs) {
  const today = dayjs(nowMs).tz(rules.timezone).format('YYYY-MM-DD');
  return addDays(today, rules.maxAdvanceDays);
}

// 判斷單一格的狀態，由上往下檢查，符合就回傳
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
    // 服務本身要在營業時間內結束，但 buffer 可以超過打烊時間
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

// 週曆的主要計算。這是純函式：相同輸入一定得到相同結果，也不碰資料庫，所以很好測試
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

// 建立預約前再檢查一次時間。不能預約時回傳錯誤代碼，可以預約時回傳 null
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

// 算出這筆預約要鎖住哪些時段：每 30 分鐘一格，包含服務時間和 buffer。
// 兩筆重疊的預約一定會搶到同一格，所以不會重複預約
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

// 把日期範圍換成毫秒，查詢資料庫時使用
export function getDayRange(from, to, timezoneName) {
  const startMs = dayjs.tz(`${from} 00:00`, timezoneName).valueOf();
  const endMs = dayjs.tz(`${addDays(to, 1)} 00:00`, timezoneName).valueOf();
  return { startMs, endMs };
}

// 取得台灣時間的日期字串
export function getLocalDate(value, timezoneName) {
  return dayjs(value).tz(timezoneName).format('YYYY-MM-DD');
}
