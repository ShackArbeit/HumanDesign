import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryState } from '../../components/QueryState';
import { useServices } from '../../hooks/useServices';
import { useAuth } from '../auth/AuthProvider';
import AvailabilityWeekGrid from './AvailabilityWeekGrid';
import BookingForm from './BookingForm';

const getDurationOptions = (services) =>
  [...new Set(services.flatMap((service) => service.options.map((o) => o.durationMin)))].sort(
    (a, b) => a - b,
  );

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
  const query = useServices();

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
      <QueryState query={query}>{(services) => <BookingContent services={services} />}</QueryState>
    </Box>
  );
};

export default BookingPage;
