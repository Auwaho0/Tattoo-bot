import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { Work } from './model/types';

export const workKeys = {
  all: ['works'] as const,
  list: () => [...workKeys.all, 'list'] as const,
};

export const fetchWorks = async (): Promise<Work[]> => {
  const { data } = await apiClient.get<Work[]>('/api/portfolio');
  console.log('Fetched works:', data); // Log the fetched data for debugging
  return data;
};

export const useWorksQuery = () =>
  useQuery({
    queryKey: workKeys.list(),
    queryFn: fetchWorks,
    staleTime: 1000 * 60 * 60 * 1,   // 1 час
    gcTime: 1000 * 60 * 60 * 24,   // 24 часа держим в памяти
    retry: 2,
    refetchOnWindowFocus: false,       // не дёргать при каждом alt-tab
    refetchOnReconnect: false,
  });