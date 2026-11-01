import { useQuery } from '@tanstack/react-query';
import { fetchMyBookings } from '../api/bookings';
import { useAuth } from '../features/auth/AuthProvider';
import { queryKeys } from '../lib/queryKeys';

export const useMyBookings = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.myBookings,
    queryFn: fetchMyBookings,
    enabled: Boolean(user),
  });
};
