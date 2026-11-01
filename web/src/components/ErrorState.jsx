import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export const ErrorState = ({ message = '資料載入失敗，請稍後再試', onRetry }) => (
  <Box sx={{ p: 3, maxWidth: 1120, mx: 'auto' }}>
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={() => onRetry()}>
            重試
          </Button>
        )
      }
    >
      {message}
    </Alert>
  </Box>
);
