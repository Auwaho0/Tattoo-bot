import { useEffect, useMemo, useRef, useState } from 'react';
import { useWorksQuery, usePrefetchNextWorks } from '@/entities/work';
import type { Work, SortOrder } from '@/entities/work';
import { WorkCard, WorkCardSkeleton } from '@/widgets/work-grid';
import { SkeletonGrid } from '@/shared/ui';
import { PortfolioSort } from '@/features/portfolio/portfolio-sort';
import { LoadMoreButton } from '@/features/portfolio/load-more';
import { BackButton, OrnamentLine } from '@/shared/ui';

export const PortfolioPage = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('new');
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWorksQuery(sortOrder);
  const prefetchNext = usePrefetchNextWorks(sortOrder);

  const works: Work[] = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;
  const pagesCount = data?.pages.length ?? 0;

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

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
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
            ПОРТФОЛИО
          </h1>
          <p className="text-dim text-xs font-nunito">
            Мои работы{total > 0 && ` · ${total}`}
          </p>


          <OrnamentLine />

        </header>

        {!isLoading && !isError && total > 1 && (
          <div className="flex flex-col items-end max-w-md w-full">
            <PortfolioSort value={sortOrder} onChange={setSortOrder} />
          </div>
        )}

        {isLoading && (
          <SkeletonGrid
            count={6}
            renderItem={(i) => <WorkCardSkeleton key={i} index={i} />}
          />
        )}

        {isError && (
          <div className="text-blood py-8 text-center">
            Не удалось загрузить работы.
            <br />
            <span className="text-dim text-sm">Проверьте соединение и попробуйте снова.</span>
          </div>
        )}

        {!isLoading && !isError && works.length === 0 && (
          <div className="text-dim py-8 text-center">
            Пока нет работ. Добавьте их через бота:
            <br />
            <span className="text-gold">/admin → Добавить работу</span>
          </div>
        )}

        {!isLoading && !isError && works.length > 0 && (
          <>
            <div ref={prefetchRef} aria-hidden className="h-1 w-full" />
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {works.map((work, i) => (
                <WorkCard key={work.id} work={work} index={i} />
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