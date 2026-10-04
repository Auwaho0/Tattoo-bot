export interface Sketch {
  id: number;
  title: string;
  size: string;
  placement: string;
  old_price: number;
  new_price: number;
  status: 'free' | 'sold';
  photo_file_id: string;
  created_at: string;
}

export interface SketchPage {
  items: Sketch[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}