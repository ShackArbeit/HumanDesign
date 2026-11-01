import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { QueryState } from '../../components/QueryState';
import { useCancelBooking } from '../../hooks/useBookingMutations';
import { useMyBookings } from '../../hooks/useMyBookings';
import { useServices } from '../../hooks/useServices';
import { formatDateTime } from '../../lib/datetime';

const CANCEL_CUTOFF_HOURS = 24;

const STATUS_LABELS = {
  pending_payment: '待匯款',
  confirmed: '已確認',
  cancelled: '已取消',
};

const canCancel = (booking) =>
  booking.status !== 'cancelled' &&
  dayjs(booking.startAt).diff(dayjs(), 'hour', true) >= CANCEL_CUTOFF_HOURS;

const MyBookings = () => {
  const navigate = useNavigate();
  const query = useMyBookings();
  const services = useServices();
  const cancel = useCancelBooking();
  const [target, setTarget] = useState(null);

  const serviceName = (id) => services.data?.find((service) => service.id === id)?.name ?? id;

  const handleConfirm = () => {
    cancel.mutate({ id: target.id }, { onSuccess: () => setTarget(null) });
  };

  return (
    <Box component="main" sx={{ maxWidth: 720, mx: 'auto', px: 2, pt: 12, pb: 4 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        我的預約
      </Typography>
      <QueryState query={query}>
        {(bookings) =>
          bookings.length === 0 ? (
            <EmptyState
              message="目前沒有預約"
              actionLabel="前往預約"
              onAction={() => navigate('/booking')}
            />
          ) : (
            <Stack spacing={2}>
              {bookings.map((booking) => (
                <Card variant="outlined" key={booking.id}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700 }}>
                      {serviceName(booking.serviceId)}（{booking.durationMin} 分鐘）
                    </Typography>
                    <Typography>{formatDateTime(booking.startAt)}</Typography>
                    <Typography>
                      NT$ {booking.priceTwd.toLocaleString('en-US')}｜
                      {STATUS_LABELS[booking.status]}
                    </Typography>
                    {canCancel(booking) && (
                      <Button sx={{ mt: 1 }} color="error" onClick={() => setTarget(booking)}>
                        取消預約
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )
        }
      </QueryState>
      <Dialog open={Boolean(target)} onClose={() => setTarget(null)}>
        <DialogTitle>確定要取消這筆預約嗎？</DialogTitle>
        <DialogContent>
          {target && <Typography>{formatDateTime(target.startAt)}</Typography>}
          {cancel.error && <Alert severity="error">{cancel.error.message}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTarget(null)}>返回</Button>
          <Button color="error" disabled={cancel.isPending} onClick={handleConfirm}>
            確認取消
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;
