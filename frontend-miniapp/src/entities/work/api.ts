import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { WorkPage, SortOrder } from './model/types';

export const PAGE_SIZE = 12;

export const workKeys = {
  all: ['works'] as const,
  list: (order: SortOrder) => [...workKeys.all, 'list', order] as const,
};

export const fetchWorks = async (
  offset: number,
  order: SortOrder,
): Promise<WorkPage> => {
  const { data } = await apiClient.get<WorkPage>('/api/portfolio', {
    params: { limit: PAGE_SIZE, offset, order },
  });
  return data;
};

export const useWorksQuery = (order: SortOrder = 'new') =>
  useInfiniteQuery({
    queryKey: workKeys.list(order),
    queryFn: ({ pageParam }) => fetchWorks(pageParam, order),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.offset + lastPage.limit : undefined,
    staleTime: 1000 * 60 * 60,   // 1 час
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });