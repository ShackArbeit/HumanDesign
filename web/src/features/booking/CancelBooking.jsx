import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useCancelBooking } from '../../hooks/useBookingMutations';


const CancelBooking = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const cancel = useCancelBooking();

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', px: 2, py: 6 }}>
      <Stack spacing={2}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          取消預約
        </Typography>
        {cancel.isSuccess ? (
          <>
            <Alert severity="success">預約已取消</Alert>
            <Link to="/booking">重新預約</Link>
          </>
        ) : (
          <>
            <Typography>確定要取消這筆預約嗎？取消後時段會開放給其他人。</Typography>
            {cancel.error && <Alert severity="error">{cancel.error.message}</Alert>}
            <Button
              variant="contained"
              color="error"
              disabled={cancel.isPending}
              onClick={() => cancel.mutate({ id, token: searchParams.get('token') })}
            >
              確認取消
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default CancelBooking;
