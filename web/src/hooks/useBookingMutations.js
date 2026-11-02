import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking, createBooking } from '../api/bookings';
import { queryKeys } from '../lib/queryKeys';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    // Refresh after success or failure: a 409 also means the calendar is out of date.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availabilityAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availabilityAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings });
    },
  });
}
