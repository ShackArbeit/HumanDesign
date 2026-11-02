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
import { ErrorState } from '../../components/ErrorState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
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

function canCancel(booking) {
  if (booking.status === 'cancelled') {
    return false;
  }
  const hoursLeft = dayjs(booking.startAt).diff(dayjs(), 'hour', true);
  return hoursLeft >= CANCEL_CUTOFF_HOURS;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const { data: bookings, isLoading, isError, refetch } = useMyBookings();
  const { data: services } = useServices();
  const cancelMutation = useCancelBooking();
  const [bookingToCancel, setBookingToCancel] = useState(null);

  function getServiceName(serviceId) {
    if (!services) {
      return serviceId;
    }
    const service = services.find((item) => item.id === serviceId);
    return service ? service.name : serviceId;
  }

  function handleConfirmCancel() {
    cancelMutation.mutate(
      { id: bookingToCancel.id },
      { onSuccess: () => setBookingToCancel(null) },
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 2, py: 4 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        我的預約
      </Typography>

      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && bookings.length === 0 && (
        <EmptyState
          message="目前沒有預約"
          actionLabel="前往預約"
          onAction={() => navigate('/booking')}
        />
      )}

      {!isLoading && !isError && bookings.length > 0 && (
        <Stack spacing={2}>
          {bookings.map((booking) => (
            <Card variant="outlined" key={booking.id}>
              <CardContent>
                <Typography sx={{ fontWeight: 700 }}>
                  {getServiceName(booking.serviceId)}（{booking.durationMin} 分鐘）
                </Typography>
                <Typography>{formatDateTime(booking.startAt)}</Typography>
                <Typography>
                  NT$ {booking.priceTwd.toLocaleString('en-US')}｜{STATUS_LABELS[booking.status]}
                </Typography>
                {canCancel(booking) && (
                  <Button sx={{ mt: 1 }} color="error" onClick={() => setBookingToCancel(booking)}>
                    取消預約
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={bookingToCancel !== null} onClose={() => setBookingToCancel(null)}>
        <DialogTitle>確定要取消這筆預約嗎？</DialogTitle>
        <DialogContent>
          {bookingToCancel && <Typography>{formatDateTime(bookingToCancel.startAt)}</Typography>}
          {cancelMutation.error && <Alert severity="error">{cancelMutation.error.message}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingToCancel(null)}>返回</Button>
          <Button color="error" disabled={cancelMutation.isPending} onClick={handleConfirmCancel}>
            確認取消
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;
