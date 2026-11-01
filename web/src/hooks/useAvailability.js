import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchAvailability } from '../api/availability';
import { formatDate, toTaipei } from '../lib/datetime';
import { queryKeys } from '../lib/queryKeys';

const STALE_MS = 30 * 1000;

const weekQuery = (weekStart, durationMin) => ({
  queryKey: queryKeys.availability(weekStart, durationMin),
  queryFn: () =>
    fetchAvailability({
      from: weekStart,
      to: formatDate(toTaipei(weekStart).add(6, 'day')),
      durationMin,
    }),
  staleTime: STALE_MS,
});

export const useAvailability = ({ weekStart, durationMin }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const nextWeek = formatDate(toTaipei(weekStart).add(7, 'day'));
    queryClient.prefetchQuery(weekQuery(nextWeek, durationMin));
  }, [queryClient, weekStart, durationMin]);

  return useQuery({ ...weekQuery(weekStart, durationMin), placeholderData: keepPreviousData });
};
