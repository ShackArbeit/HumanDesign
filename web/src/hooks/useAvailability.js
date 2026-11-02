// 用 React Query 抓週曆資料
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchAvailability } from '../api/availability';
import { formatDate, toTaipei } from '../lib/datetime';
import { queryKeys } from '../lib/queryKeys';

const STALE_TIME_MS = 30 * 1000;

// 抓一整週（七天）的資料
function fetchWeek(weekStart, durationMin) {
  const weekEnd = formatDate(toTaipei(weekStart).add(6, 'day'));
  return fetchAvailability({ from: weekStart, to: weekEnd, durationMin });
}

export function useAvailability({ weekStart, durationMin }) {
  const queryClient = useQueryClient();

  // 先把下一週載入，按「下一週」時就不用等待
  useEffect(() => {
    const nextWeek = formatDate(toTaipei(weekStart).add(7, 'day'));
    queryClient.prefetchQuery({
      queryKey: queryKeys.availability(nextWeek, durationMin),
      queryFn: () => fetchWeek(nextWeek, durationMin),
      staleTime: STALE_TIME_MS,
    });
  }, [queryClient, weekStart, durationMin]);

  return useQuery({
    queryKey: queryKeys.availability(weekStart, durationMin),
    queryFn: () => fetchWeek(weekStart, durationMin),
    staleTime: STALE_TIME_MS,
    // 切換週時先保留舊畫面，避免閃爍
    placeholderData: keepPreviousData,
  });
}
