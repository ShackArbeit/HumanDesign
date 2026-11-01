import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking, createBooking } from '../api/bookings';
import { queryKeys } from '../lib/queryKeys';

const useInvalidateBookings = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.availabilityAll }),
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings }),
    ]);
};

export const useCreateBooking = () => {
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: createBooking,
    onSettled: invalidate,
  });
};

export const useCancelBooking = () => {
  const invalidate = useInvalidateBookings();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: invalidate,
  });
};
