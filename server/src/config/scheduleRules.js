const OPEN_DAY = [
  { start: '10:00', end: '12:00' },
  { start: '14:00', end: '18:00' },
  { start: '19:00', end: '21:00' },
];

// 預約規則。要調整營業時間、buffer 或可預約天數都改這裡。
// TODO(shack): 確認營業時間與休息日。
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

// 預約開始前 24 小時內不可取消
export const CANCEL_CUTOFF_HOURS = 24;
