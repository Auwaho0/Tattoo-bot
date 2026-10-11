import { useEffect, useMemo, useRef } from 'react';
import { useSketchesQuery, usePrefetchNextSketches } from '@/entities/sketch';
import type { Sketch } from '@/entities/sketch';
import { SketchCard, SketchCardSkeleton } from '@/widgets/sketch-grid';
import { SkeletonGrid } from '@/shared/ui';
import { LoadMoreButton } from '@/features/portfolio/load-more';
import { BackButton, OrnamentLine } from '@/shared/ui';

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
    <div className="min-h-screen p-4 bg-surface theme-transition text-main">
      <div className="max-w-md mx-auto flex flex-col gap-4">

        <BackButton />


        <header className="mt-2 flex flex-col gap-1">
          <h1 className="text-2xl font-nunito text-gold tracking-wider">
            ЭСКИЗЫ
          </h1>
          <p className="text-dim text-xs font-nunito">
            Со скидкой{total > 0 && ` · ${total}`}
          </p>

          <OrnamentLine />
        </header>


        {isLoading && (
          <SkeletonGrid
            count={6}
            renderItem={(i) => <SketchCardSkeleton key={i} index={i} />}
          />
        )}


        {isError && (
          <div className="text-blood py-8 text-center">
            Не удалось загрузить эскизы.
            <br />
            <span className="text-dim text-sm">
              Проверьте соединение и попробуйте снова.
            </span>
          </div>
        )}


        {!isLoading && !isError && sketches.length === 0 && (
          <div className="text-dim py-8 text-center">
            Пока нет эскизов. Добавьте их через бота:
            <br />
            <span className="text-gold">/admin → Добавить эскиз</span>
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