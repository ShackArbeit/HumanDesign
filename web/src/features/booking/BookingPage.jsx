import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorState } from '../../components/ErrorState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { useServices } from '../../hooks/useServices';
import { useAuth } from '../auth/AuthProvider';
import AvailabilityWeekGrid from './AvailabilityWeekGrid';
import BookingForm from './BookingForm';

function getDurationOptions(services) {
  const durations = [];
  for (const service of services) {
    for (const option of service.options) {
      if (!durations.includes(option.durationMin)) {
        durations.push(option.durationMin);
      }
    }
  }
  durations.sort((a, b) => a - b);
  return durations;
}

const BookingContent = ({ services }) => {
  const durationOptions = getDurationOptions(services);
  const [durationMin, setDurationMin] = useState(durationOptions[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotTaken, setSlotTaken] = useState(false);

  return (
    <>
      <AvailabilityWeekGrid
        durationOptions={durationOptions}
        durationMin={durationMin}
        onDurationChange={setDurationMin}
        onSelectSlot={setSelectedSlot}
      />
      {selectedSlot && (
        <BookingForm
          services={services}
          slot={selectedSlot}
          durationMin={durationMin}
          onClose={() => setSelectedSlot(null)}
          onSlotTaken={() => {
            setSelectedSlot(null);
            setSlotTaken(true);
          }}
        />
      )}
      <Snackbar open={slotTaken} autoHideDuration={6000} onClose={() => setSlotTaken(false)}>
        <Alert severity="warning" onClose={() => setSlotTaken(false)}>
          此時段剛剛被別人預約了，請選擇其他時段
        </Alert>
      </Snackbar>
    </>
  );
};

const BookingPage = () => {
  const { user } = useAuth();
  const { data: services, isLoading, isError, refetch } = useServices();

  return (
    <Box sx={{ maxWidth: 1120, mx: 'auto', px: 2, py: 4 }}>
      <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        線上預約
      </Typography>
      <Typography sx={{ mb: 3 }}>
        請選擇時段，所有時間皆為台灣時間。
        {!user && (
          <>
            {' '}
            不登入也能預約，或<Link to="/signin">登入會員</Link>以查看預約紀錄。
          </>
        )}
      </Typography>
      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && <BookingContent services={services} />}
    </Box>
  );
};

export default BookingPage;
