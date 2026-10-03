import axios, { type AxiosInstance } from 'axios';
import { getInitData } from '@/shared/lib';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const initData = getInitData();
  if (initData) {
    config.headers.set('X-Init-Data', initData);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn('[api] 401 — невалидный initData');
    }
    return Promise.reject(error);
  },
);