export interface Work {
  id: number;
  title: string;
  size: string;
  placement: string;
  duration: string;
  price: number;
  photo_file_id: string;
  description: string | null;
  created_at: string;      // ISO-строка из JSON
}