import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
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
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });

/**
 * Фоновый prefetch следующей страницы.
 * Вызывается из отдельного observer'а с большим rootMargin.
 */
export const usePrefetchNextWorks = (order: SortOrder = 'new') => {
  const qc = useQueryClient();

  return (nextOffset: number) => {
    const key = workKeys.list(order);

    // Если последняя страница уже сказала «всё» — не грузим
    const cached = qc.getQueryData<InfiniteData<WorkPage>>(key);
    const lastPage = cached?.pages[cached.pages.length - 1];
    if (lastPage && !lastPage.has_more) return;

    qc.prefetchInfiniteQuery({
      queryKey: key,
      queryFn: ({ pageParam }) => fetchWorks(pageParam as number, order),
      initialPageParam: nextOffset,
      getNextPageParam: (last: { has_more: any; offset: any; limit: any; }) =>
        last.has_more ? last.offset + last.limit : undefined,
      staleTime: 1000 * 60 * 60,
    });
  };
};