const OPEN_DAY = [
  { start: '10:00', end: '12:00' },
  { start: '14:00', end: '18:00' },
  { start: '19:00', end: '21:00' },
];

// TODO(shack): confirm business hours, closed days, buffer and booking window.
export const defaultScheduleRules = {
  timezone: 'Asia/Taipei',
  slotMinutes: 30,
  bufferMinutes: 30,
  minLeadDays: 3,
  maxAdvanceDays: 60,
  weekly: {
    sun: [],
    mon: [],
    tue: OPEN_DAY,
    wed: OPEN_DAY,
    thu: OPEN_DAY,
    fri: OPEN_DAY,
    sat: OPEN_DAY,
  },
};

export const CANCEL_CUTOFF_HOURS = 24;
