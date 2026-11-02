import { describe, expect, it } from 'vitest';
import { defaultScheduleRules as rules } from '../src/config/scheduleRules.js';
import {
  computeAvailability,
  getSlotLocks,
  validateBookingTime,
} from '../src/lib/availability.js';

// Sunday 2026-11-01 10:00 in Taipei.
const now = '2026-11-01T02:00:00Z';
const THU = '2026-11-05';

const taipei = (date, time) => `${date}T${time}:00+08:00`;
const utcIso = (date, time) => new Date(taipei(date, time)).toISOString().replace('.000Z', 'Z');

const booking = (date, start, end, status = 'confirmed') => ({
  startAt: taipei(date, start),
  endAt: taipei(date, end),
  status,
});

const dayOf = (args = {}, date = THU) =>
  computeAvailability({ rules, now, from: date, to: date, ...args }).days[0];

const statusAt = (day, date, time) =>
  day.slots.find((slot) => slot.start === utcIso(date, time))?.status;

describe('computeAvailability', () => {
  it('computes Taipei business hours as UTC instants', () => {
    const day = dayOf();
    expect(day.weekday).toBe(4);
    expect(day.slots[0]).toEqual({
      start: '2026-11-05T02:00:00Z',
      end: '2026-11-05T02:30:00Z',
      status: 'available',
    });
  });

  it('returns the same rows for every day so the week table aligns', () => {
    const { days } = computeAvailability({ rules, now, from: '2026-11-08', to: '2026-11-10' });
    expect(new Set(days.map((day) => day.slots.length)).size).toBe(1);
  });

  it('marks the gaps between business ranges as closed', () => {
    expect(statusAt(dayOf(), THU, '12:30')).toBe('closed');
    expect(statusAt(dayOf(), THU, '18:30')).toBe('closed');
  });

  it('marks weekly rest days as closed', () => {
    const day = dayOf({}, '2026-11-09');
    expect(day.slots.every((slot) => slot.status === 'closed')).toBe(true);
  });

  it('blocks a booking that crosses the hour, plus its buffer', () => {
    const day = dayOf({ bookings: [booking(THU, '14:30', '15:30')] });
    expect(statusAt(day, THU, '14:00')).toBe('available');
    expect(statusAt(day, THU, '14:30')).toBe('booked');
    expect(statusAt(day, THU, '15:00')).toBe('booked');
    expect(statusAt(day, THU, '15:30')).toBe('booked');
    expect(statusAt(day, THU, '16:00')).toBe('available');
  });

  it('checks every booking, not only the first one', () => {
    const day = dayOf({
      bookings: [booking(THU, '10:00', '11:00'), booking(THU, '16:00', '17:00')],
    });
    expect(statusAt(day, THU, '10:00')).toBe('booked');
    expect(statusAt(day, THU, '16:00')).toBe('booked');
  });

  it('requires the whole 120-minute session and buffer to be free', () => {
    const day = dayOf({ durationMin: 120, bookings: [booking(THU, '16:00', '17:00')] });
    expect(statusAt(day, THU, '14:00')).toBe('booked');
    expect(statusAt(day, THU, '10:00')).toBe('available');
    expect(statusAt(day, THU, '10:30')).toBe('closed');
  });

  it('keeps a start free when its buffer ends exactly as the next booking begins', () => {
    const day = dayOf({ durationMin: 60, bookings: [booking(THU, '15:30', '16:30')] });
    expect(statusAt(day, THU, '14:00')).toBe('available');
    expect(statusAt(day, THU, '14:30')).toBe('booked');
  });

  it('does not let a session run past closing, but allows its buffer to', () => {
    const day = dayOf({ durationMin: 120 });
    expect(statusAt(day, THU, '16:00')).toBe('available');
    expect(statusAt(day, THU, '16:30')).toBe('closed');
    expect(statusAt(day, THU, '19:00')).toBe('available');
  });

  it('ignores cancelled bookings', () => {
    const day = dayOf({ bookings: [booking(THU, '10:00', '11:00', 'cancelled')] });
    expect(statusAt(day, THU, '10:00')).toBe('available');
  });

  it('applies a full-day closure with its reason', () => {
    const day = dayOf({ closures: [{ date: THU, reason: '國定假日休息', ranges: null }] });
    expect(day.closedReason).toBe('國定假日休息');
    expect(day.slots.every((slot) => slot.status === 'closed')).toBe(true);
  });

  it('applies a partial closure', () => {
    const ranges = [{ start: '14:00', end: '16:00' }];
    const day = dayOf({ closures: [{ date: THU, reason: '外出', ranges }] });
    expect(statusAt(day, THU, '10:00')).toBe('available');
    expect(statusAt(day, THU, '14:30')).toBe('closed');
    expect(statusAt(day, THU, '16:00')).toBe('available');
  });

  it('separates past, too_soon and available around the three-day lead', () => {
    expect(statusAt(dayOf({}, '2026-11-03'), '2026-11-03', '10:00')).toBe('too_soon');
    expect(statusAt(dayOf({}, '2026-11-04'), '2026-11-04', '10:00')).toBe('available');

    const later = dayOf({ now: '2026-11-03T04:00:00Z' }, '2026-11-03');
    expect(statusAt(later, '2026-11-03', '11:30')).toBe('past');
    expect(statusAt(later, '2026-11-03', '14:00')).toBe('too_soon');
  });

  it('closes dates beyond the booking window', () => {
    expect(statusAt(dayOf({}, '2026-12-31'), '2026-12-31', '10:00')).toBe('available');
    expect(statusAt(dayOf({}, '2027-01-01'), '2027-01-01', '10:00')).toBe('closed');
  });

  it('groups by Taipei date when the UTC date differs', () => {
    const early = { ...rules, weekly: { ...rules.weekly, thu: [{ start: '07:00', end: '08:00' }] } };
    const day = dayOf({ rules: early });
    expect(day.date).toBe(THU);
    expect(day.slots[0].start).toBe('2026-11-04T23:00:00Z');
  });
});

describe('validateBookingTime', () => {
  const check = (startAt, durationMin = 60, closures = []) =>
    validateBookingTime({ rules, closures, startAt, durationMin, now });

  it('accepts a start inside business hours', () => {
    expect(check(taipei(THU, '10:00'))).toBeNull();
  });

  it('rejects starts that are too soon or too far', () => {
    expect(check(taipei('2026-11-03', '10:00'))).toBe('TOO_SOON');
    expect(check(taipei('2027-01-05', '10:00'))).toBe('TOO_FAR');
  });

  it('rejects closed days, overruns and off-grid starts', () => {
    expect(check(taipei('2026-11-09', '10:00'))).toBe('OUTSIDE_BUSINESS_HOURS');
    expect(check(taipei(THU, '11:30'))).toBe('OUTSIDE_BUSINESS_HOURS');
    expect(check(taipei(THU, '10:15'))).toBe('OUTSIDE_BUSINESS_HOURS');
    expect(check(taipei(THU, '10:00'), 60, [{ date: THU, ranges: null }])).toBe(
      'OUTSIDE_BUSINESS_HOURS',
    );
  });
});

describe('getSlotLocks', () => {
  it('covers a 120-minute session plus buffer in Taipei time', () => {
    const locks = getSlotLocks({ rules, startAt: taipei(THU, '14:00'), durationMin: 120 });
    expect(locks.map((lock) => lock.id)).toEqual([
      '20261105-1400',
      '20261105-1430',
      '20261105-1500',
      '20261105-1530',
      '20261105-1600',
    ]);
  });

  it('rolls over to the next day', () => {
    const locks = getSlotLocks({ rules, startAt: taipei(THU, '23:30'), durationMin: 60 });
    expect(locks.at(-1).id).toBe('20261106-0030');
  });
});
