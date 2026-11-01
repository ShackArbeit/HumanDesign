import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const EmptyState = ({ message, actionLabel, onAction }) => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography color="text.secondary" sx={{ mb: actionLabel ? 2 : 0 }}>
      {message}
    </Typography>
    {actionLabel && (
      <Button variant="outlined" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);
