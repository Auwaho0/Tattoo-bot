export interface BookingCreate {
  name: string;
  size: string;
  placement: string;
  dates: string;
  budget: number;
  photo_file_id?: string | null;
  user_id: string;
}

export interface BookingResponse {
  id: number;
  name: string;
  size: string;
  placement: string;
  dates: string;
  budget: number;
  photo_file_id: string | null;
  user_id: string;
  status: string;
  created_at: string;
}