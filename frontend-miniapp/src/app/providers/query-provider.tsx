import { useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useIsRestoring,
  useQueryClient,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import type { ReactNode } from "react";

import { workKeys, fetchWorks } from "@/entities/work";

// ---------------------------------------------------------------------------
// QueryClient
// ---------------------------------------------------------------------------
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,           // 5 мин по умолчанию
      gcTime: 1000 * 60 * 60 * 24 * 7,    // 7 дней — работы добавляются раз в неделю
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ---------------------------------------------------------------------------
// Персистер в localStorage
// ---------------------------------------------------------------------------
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "everart-query-cache",
  throttleTime: 1000,
});

// ---------------------------------------------------------------------------
// Префетч портфолио. Дергается ОДИН РАЗ после гидрации кэша из localStorage.
// Ждём isRestoring === false — это гарантирует, что:
//   1) если в кэше уже есть работы — префетч просто обновит их в фоне
//   2) если кэш пустой (первый визит / TTL истёк) — префетч положит свежие данные
// ---------------------------------------------------------------------------
const PortfolioPrefetcher = () => {
  const isRestoring = useIsRestoring();
  const qc = useQueryClient();

  useEffect(() => {
    if (isRestoring) return;

    qc.prefetchInfiniteQuery({
      queryKey: workKeys.list("new"),
      queryFn: ({ pageParam }) => fetchWorks(pageParam as number, "new"),
      initialPageParam: 0,
      getNextPageParam: (last: { has_more: boolean; offset: number; limit: number; }) =>
        last.has_more ? last.offset + last.limit : undefined,
    });
  }, [isRestoring, qc]);

  return null;
};

// ---------------------------------------------------------------------------
// Провайдер
// ---------------------------------------------------------------------------
interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
      dehydrateOptions: {
        // Кэшируем только works и sketches. Заявки/фото — нет.
        shouldDehydrateQuery: (query) => {
          const key = query.queryKey[0];
          return key === "works" || key === "sketches";
        },
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <PortfolioPrefetcher />
      {children}
    </QueryClientProvider>
  </PersistQueryClientProvider>
);