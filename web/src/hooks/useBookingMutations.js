// 建立和取消預約的 hook，成功後會更新相關資料
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking, createBooking } from '../api/bookings';
import { queryKeys } from '../lib/queryKeys';

// 建立預約
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    // 成功或失敗都重新抓資料：收到 409 也代表週曆已經過期
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availabilityAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings });
    },
  });
}

// 取消預約，成功後更新週曆和我的預約
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
