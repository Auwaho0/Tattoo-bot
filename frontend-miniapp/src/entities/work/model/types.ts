export interface Work {
  id: number;
  title: string;
  size: string;
  placement: string;
  duration: string;
  price: number;
  photo_file_id: string;
  description: string | null;
  created_at: string;
}

export interface WorkPage {
  items: Work[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export type SortOrder = 'new' | 'old';