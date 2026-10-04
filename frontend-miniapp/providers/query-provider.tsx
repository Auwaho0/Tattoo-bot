import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,   // 24 часа — важно для persist
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'everart-query-cache',
  throttleTime: 1000,   // сохраняем раз в секунду максимум
});

export const QueryProvider = ({ children }: { children: ReactNode }) => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister,
      maxAge: 1000 * 60 * 60 * 24,   // кэш живёт сутки
      // Какие ключи сохранять. Портфолио и эскизы — да, заявки — нет.
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          const key = query.queryKey[0];
          return key === 'works' || key === 'sketches';
        },
      },
    }}
  >
    {children}
  </PersistQueryClientProvider>
);