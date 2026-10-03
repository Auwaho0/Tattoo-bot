import axios, { type AxiosInstance } from 'axios';
import { getInitData } from '@/shared/lib';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const initData = getInitData();
  if (initData) {
    config.headers.set('X-Init-Data', initData);
  }
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error('[api]', err?.response?.status, err?.message);
    return Promise.reject(err);
  },
);