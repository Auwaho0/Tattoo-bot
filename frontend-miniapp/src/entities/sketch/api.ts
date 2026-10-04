import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { SketchPage } from './model/types';

export const PAGE_SIZE = 12;

export const sketchKeys = {
  all: ['sketches'] as const,
  list: () => [...sketchKeys.all, 'list'] as const,
};

export const fetchSketches = async (offset: number): Promise<SketchPage> => {
  const { data } = await apiClient.get<SketchPage>('/api/sketches', {
    params: { limit: PAGE_SIZE, offset },
  });
  return data;
};

export const useSketchesQuery = () =>
  useInfiniteQuery({
    queryKey: sketchKeys.list(),
    queryFn: ({ pageParam }) => fetchSketches(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.offset + lastPage.limit : undefined,
    staleTime: 1000 * 60 * 5,     // 5 минут — статус free/sold должен быть свежим
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,    // вернулся в Mini App → проверь актуальность
    refetchOnReconnect: true,
    retry: 2,
  });