// 預約成功後的確認畫面
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { formatDateTime, toTaipei } from '../../lib/datetime';

const toCalendarTime = (value) => toTaipei(value).utc().format('YYYYMMDDTHHmmss[Z]');

// 組出「加入 Google 日曆」的連結
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
    <Alert severity={booking.emailSent === false ? 'warning' : 'success'}>
      {booking.emailSent === false
        ? '預約已成功，但確認信寄送失敗，請保存此頁資訊'
        : '預約已送出，確認信已寄到你的信箱'}
    </Alert>
    <Typography>項目：{serviceName}（{booking.durationMin} 分鐘）</Typography>
    <Typography>時間：{formatDateTime(booking.startAt)}</Typography>
    <Typography>費用：NT$ {booking.priceTwd.toLocaleString('en-US')}</Typography>
    <Typography>請於三日內完成匯款，確認款項後即完成預約。</Typography>
    {booking.paymentInfo && (
      <Alert severity="info" icon={false}>
        {booking.paymentInfo.isDemo && <strong>示範資料，請勿實際匯款</strong>}
        <Typography>銀行：{booking.paymentInfo.bankName}</Typography>
        <Typography>戶名：{booking.paymentInfo.accountName}</Typography>
        <Typography>帳號：{booking.paymentInfo.accountNumber}</Typography>
      </Alert>
    )}
    {booking.cancelToken && (
      <Typography>
        需要取消嗎？
        <Link to={`/bookings/${booking.id}/cancel?token=${booking.cancelToken}`}>取消此預約</Link>
        （預約開始前 1 天內不可取消）
      </Typography>
    )}
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
