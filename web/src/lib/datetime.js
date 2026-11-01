import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const APP_TIMEZONE = 'Asia/Taipei';

export const toTaipei = (value) => dayjs(value).tz(APP_TIMEZONE);

export const todayInTaipei = () => dayjs().tz(APP_TIMEZONE).startOf('day');

// Weeks start on Monday, as in the booking week table.
export const startOfWeek = (value) => {
  const date = toTaipei(value).startOf('day');
  const daysSinceMonday = (date.day() + 6) % 7;
  return date.subtract(daysSinceMonday, 'day');
};

export const formatDate = (value) => toTaipei(value).format('YYYY-MM-DD');
