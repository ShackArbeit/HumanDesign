// 載入中的灰色骨架畫面
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export const LoadingSkeleton = ({ rows = 3 }) => (
  <Box role="status" aria-label="載入中" sx={{ p: 3, maxWidth: 1120, mx: 'auto' }}>
    {Array.from({ length: rows }, (_, index) => (
      <Skeleton key={index} variant="rounded" height={96} sx={{ mb: 2 }} />
    ))}
  </Box>
);
