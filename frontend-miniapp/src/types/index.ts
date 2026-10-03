export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface Work {
  id: number;
  title: string;
  style: string;
  size: string;
  placement: string;
  duration: string;
  price: number;
  photo_url: string;
  description?: string;
  created_at: string;
}

export interface Sketch {
  id: number;
  title: string;
  size: string;
  placement: string;
  old_price: number;
  new_price: number;
  status: 'free' | 'sold';
  photo_url: string;
  discount_percent: number;
  expires_at?: string;
}

export interface Broadcast {
  id: number;
  text: string;
  photo_file_id?: string;
  photo_url?: string;
  created_at: string;
  sent_at?: string;
  total_recipients: number;
  delivered_count: number;
  failed_count: number;
}

export interface BroadcastRequest {
  text: string;
  photo?: File;
}

export type Section = 'home' | 'portfolio' | 'sketches' | 'about' | 'aftercare' | 'contacts';