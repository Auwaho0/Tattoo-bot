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
  });