import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import type { Work } from './model/types';

export const workKeys = {
  all: ['works'] as const,
  list: (style?: string) => [...workKeys.all, 'list', style ?? 'all'] as const,
};

export const fetchWorks = async (style?: string): Promise<Work[]> => {
  const { data } = await apiClient.get<Work[]>('/api/portfolio', {
    params: style ? { style } : undefined,
  });
  return data;
};

export const useWorksQuery = (style?: string) =>
  useQuery({
    queryKey: workKeys.list(style),
    queryFn: () => fetchWorks(style),
  });