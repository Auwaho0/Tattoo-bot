import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
  });

export const usePrefetchNextSketches = () => {
  const qc = useQueryClient();

  return (nextOffset: number) => {
    const key = sketchKeys.list();

    const cached = qc.getQueryData<InfiniteData<SketchPage>>(key);
    const lastPage = cached?.pages[cached.pages.length - 1];
    if (lastPage && !lastPage.has_more) return;

    qc.prefetchInfiniteQuery({
      queryKey: key,
      queryFn: ({ pageParam }) => fetchSketches(pageParam as number),
      initialPageParam: nextOffset,
      getNextPageParam: (last: { has_more: any; offset: any; limit: any; }) =>
        last.has_more ? last.offset + last.limit : undefined,
      staleTime: 1000 * 60 * 5,
    });
  };
};