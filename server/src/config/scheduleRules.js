// 預約規則。要調整營業時間、時段長度或可預約天數都改這裡。
// 每天 6 個兩小時時段：上午 08–10、10–12；下午 14–16、16–18；晚上 18–20、20–22。
// 時段都從偶數整點開始，週曆的每一列才會對齊。
const OPEN_DAY = [
  { start: '08:00', end: '12:00' },
  { start: '14:00', end: '18:00' },
  { start: '18:00', end: '22:00' },
];

export const defaultScheduleRules = {
  timezone: 'Asia/Taipei',
  // 每格 2 小時，也是一次預約的長度
  slotMinutes: 120,
  // 時段首尾相接，預約之間不留緩衝
  bufferMinutes: 0,
  minLeadDays: 3,
  maxAdvanceDays: 60,
  // 週二到週六營業，週日、週一休息
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
