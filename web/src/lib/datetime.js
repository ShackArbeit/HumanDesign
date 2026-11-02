// 日期時間工具，畫面上一律顯示台灣時間
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const APP_TIMEZONE = 'Asia/Taipei';

// 把任何時間轉成台灣時區
export const toTaipei = (value) => dayjs(value).tz(APP_TIMEZONE);

export const todayInTaipei = () => dayjs().tz(APP_TIMEZONE).startOf('day');

// 找出該週的星期一，週曆從星期一開始
export const startOfWeek = (value) => {
  const date = toTaipei(value).startOf('day');
  const daysSinceMonday = (date.day() + 6) % 7;
  return date.subtract(daysSinceMonday, 'day');
};

export const formatDate = (value) => toTaipei(value).format('YYYY-MM-DD');

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

export const weekdayLabel = (value) => WEEKDAY_LABELS[toTaipei(value).day()];

export const formatTime = (value) => toTaipei(value).format('HH:mm');

// 顯示週曆標題，跨月時例如「2026年10月–11月」
export const formatMonthRange = (weekStart) => {
  const start = toTaipei(weekStart);
  const end = start.add(6, 'day');
  if (start.month() === end.month()) return start.format('YYYY年M月');
  if (start.year() === end.year()) return `${start.format('YYYY年M月')}–${end.format('M月')}`;
  return `${start.format('YYYY年M月')}–${end.format('YYYY年M月')}`;
};

export const formatDateTime = (value) => {
  const date = toTaipei(value);
  return `${date.format('YYYY年M月D日')} 星期${weekdayLabel(value)} ${date.format('HH:mm')}`;
};
