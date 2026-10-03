import { useEffect } from 'react';
import { QueryProvider } from './providers';
import { AppRoutes } from './routes';
import { initTelegram } from '@/shared/lib';
import { useTheme } from '@/features/home';

export const App = () => {
  const isDark = useTheme((s) => s.isDark);

  useEffect(() => {
    initTelegram();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  );
};