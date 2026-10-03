export interface Sketch {
  id: number;
  title: string;
  size: string;
  placement: string;
  old_price: number;
  new_price: number;
  status: 'free' | 'sold';
  photo_file_id: string;
}