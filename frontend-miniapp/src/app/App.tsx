import { useEffect } from 'react';
import { QueryProvider } from './providers';
import { AppRoutes } from './routes';
import { initTelegram } from '@/shared/lib';
import { useTelegramTheme } from '@/shared/lib/telegram/useTelegramTheme';

export const App = () => {
  useEffect(() => {
    initTelegram();
  }, []);

  useTelegramTheme();

  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  );
};