import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatDateTime, toTaipei } from '../../lib/datetime';

const toCalendarTime = (value) => toTaipei(value).utc().format('YYYYMMDDTHHmmss[Z]');

const buildGoogleCalendarUrl = ({ title, startAt, endAt }) => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toCalendarTime(startAt)}/${toCalendarTime(endAt)}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

export const BookingSummary = ({ booking, serviceName, onClose }) => (
  <Stack spacing={2}>
    <Alert severity="success">預約已送出，確認信已寄到你的信箱</Alert>
    <Typography>項目：{serviceName}（{booking.durationMin} 分鐘）</Typography>
    <Typography>時間：{formatDateTime(booking.startAt)}</Typography>
    <Typography>費用：NT$ {booking.priceTwd.toLocaleString('en-US')}</Typography>
    {/* TODO(shack): add the bank transfer details shown to customers. */}
    <Typography>請於三日內完成匯款，確認款項後即完成預約。</Typography>
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Button
        variant="outlined"
        href={buildGoogleCalendarUrl({
          title: `人類圖${serviceName}`,
          startAt: booking.startAt,
          endAt: booking.endAt,
        })}
        target="_blank"
        rel="noreferrer"
      >
        加入 Google 日曆
      </Button>
      <Button variant="contained" onClick={onClose}>
        完成
      </Button>
    </Stack>
  </Stack>
);
