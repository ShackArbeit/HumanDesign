import { useQuery } from '@tanstack/react-query';
import { fetchServices } from '../api/services';
import { queryKeys } from '../lib/queryKeys';

export const useServices = () =>
  useQuery({
    queryKey: queryKeys.services,
    queryFn: fetchServices,
    staleTime: 5 * 60 * 1000,
  });
