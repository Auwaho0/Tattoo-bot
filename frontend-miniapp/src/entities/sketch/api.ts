import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { Sketch } from './model/types';

export const sketchKeys = {
  all: ['sketches'] as const,
  list: () => [...sketchKeys.all, 'list'] as const,
};

export const fetchSketches = async (): Promise<Sketch[]> => {
  const { data } = await apiClient.get<Sketch[]>('/api/sketches');
  return data;
};

export const useSketchesQuery = () =>
  useQuery({
    queryKey: sketchKeys.list(),
    queryFn: fetchSketches,
    staleTime: 1000 * 60 * 5,        // 5 минут — статус free/sold должен быть свежим
    gcTime: 1000 * 60 * 30,       // 30 минут в памяти — хватит для навигации
    refetchOnWindowFocus: true,      // вернулся в Mini App → проверь актуальность
    refetchOnReconnect: true,        // сеть вернулась → тоже проверь
    retry: 2,
  });