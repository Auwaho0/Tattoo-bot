import { useEffect, useMemo, useRef } from 'react';
import { useSketchesQuery, usePrefetchNextSketches } from '@/entities/sketch';
import type { Sketch } from '@/entities/sketch';
import { SketchCard } from '@/widgets/sketch-grid';
import { useTheme } from '@/features/home';
import { LoadMoreButton } from '@/features/portfolio/load-more';
import { BackButton } from '@/shared/ui';

export const SketchesPage = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSketchesQuery();

  const prefetchNext = usePrefetchNextSketches();
  const isDark = useTheme((s) => s.isDark);

  const sketches: Sketch[] = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const total = data?.pages[0]?.total ?? 0;
  const pagesCount = data?.pages.length ?? 0;

  // Observer #1: PREFETCH — за 2000px до конца
  const prefetchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = prefetchRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        const pages = data?.pages ?? [];
        const last = pages[pages.length - 1];
        if (!last || !hasNextPage) return;

        prefetchNext(last.offset + last.limit);
      },
      { rootMargin: '1200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pagesCount, hasNextPage, prefetchNext]);

  // Observer #2: FETCH — за 300px до конца
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex p-4 bg-[#111111] h-full justify-center">
      <div className="flex flex-col items-center gap-4 max-w-md w-full">
        <div className="w-full max-w-md">
          <BackButton isDark={isDark} />
        </div>

        <div className="flex flex-col max-w-md w-full">
          <h1 className="serif text-2xl mt-6 ml-8 mb-2 font-nunito-san text-[#bba68d]">
            ЭСКИЗЫ
          </h1>
          <h3 className="serif text-xl ml-8 mb-4 font-nunito-san text-[#898989]">
            Со скидкой{total > 0 && ` · ${total}`}
          </h3>
        </div>

        {isLoading && <div className="text-[#898989] py-8">Загрузка…</div>}

        {isError && (
          <div className="text-red-500/80 py-8 text-center">
            Не удалось загрузить эскизы.
            <br />
            <span className="text-[#898989] text-sm">
              Проверьте соединение и попробуйте снова.
            </span>
          </div>
        )}

        {!isLoading && !isError && sketches.length === 0 && (
          <div className="text-[#898989] py-8 text-center">
            Пока нет эскизов. Добавьте их через бота:
            <br />
            <span className="text-[#bba68d]">/admin → Добавить эскиз</span>
          </div>
        )}

        {!isLoading && !isError && sketches.length > 0 && (
          <>
            <div ref={prefetchRef} aria-hidden className="h-1 w-full" />

            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {sketches.map((sketch, i) => (
                <SketchCard key={sketch.id} sketch={sketch} index={i} />
              ))}
            </div>

            <div ref={sentinelRef} aria-hidden className="h-1 w-full" />

            <LoadMoreButton
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
              hasMore={!!hasNextPage}
            />
          </>
        )}
      </div>
    </div>
  );
};