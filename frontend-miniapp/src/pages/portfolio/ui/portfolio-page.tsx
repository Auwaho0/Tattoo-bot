import { useEffect, useMemo, useRef, useState } from 'react';
import { useWorksQuery, usePrefetchNextWorks } from '@/entities/work';
import type { Work, SortOrder } from '@/entities/work';
import { WorkCard } from '@/widgets/work-grid';
import { useTheme } from '@/features/home';
import { PortfolioSort } from '@/features/portfolio/portfolio-sort';
import { LoadMoreButton } from '@/features/portfolio/load-more';
import { BackButton } from '@/shared/ui';

export const PortfolioPage = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('new');

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorksQuery(sortOrder);

  const prefetchNext = usePrefetchNextWorks(sortOrder);
  const isDark = useTheme((s) => s.isDark);

  const works: Work[] = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const total = data?.pages[0]?.total ?? 0;
  const pagesCount = data?.pages.length ?? 0;

  // =========================================================
  // Observer #1: PREFETCH — срабатывает за 2000px до конца
  // Кладёт следующую страницу в кэш заранее
  // =========================================================
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

  // =========================================================
  // Observer #2: FETCH — срабатывает за 300px до конца
  // К этому моменту данные обычно уже в кэше (prefetch успел)
  // =========================================================
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
    <div className={`flex p-4 bg-[#111111] h-full justify-center
      ${isDark
        ? 'bg-[#080808] text-[#f0ebe4]'
        : 'bg-[#e8e5dc] text-[#1c1a17]'
      }`
    }>
      <div className="flex flex-col items-center gap-4 max-w-md w-full">
        <div className="w-full max-w-md">
          <BackButton isDark={isDark} />
        </div>

        <div className="flex flex-col max-w-md w-full">
          <h1 className="serif text-2xl mt-6 ml-8 mb-2 font-nunito-san text-[#bba68d]">
            ПОРТФОЛИО
          </h1>
          <h3 className="serif text-xl ml-8 mb-4 font-nunito-san text-[#898989]">
            Мои работы{total > 0 && ` · ${total}`}
          </h3>
        </div>

        {!isLoading && !isError && total > 1 && (
          <div className="flex flex-col items-end max-w-md w-full">
            <PortfolioSort value={sortOrder} onChange={setSortOrder} />
          </div>
        )}

        {isLoading && <div className="text-[#898989] py-8">Загрузка…</div>}

        {isError && (
          <div className="text-red-500/80 py-8 text-center">
            Не удалось загрузить работы.
            <br />
            <span className="text-[#898989] text-sm">
              Проверьте соединение и попробуйте снова.
            </span>
          </div>
        )}

        {!isLoading && !isError && works.length === 0 && (
          <div className="text-[#898989] py-8 text-center">
            Пока нет работ. Добавьте их через бота:
            <br />
            <span className="text-[#bba68d]">/admin → Добавить работу</span>
          </div>
        )}

        {!isLoading && !isError && works.length > 0 && (
          <>
            {/* Prefetch-маркер — стоит ПЕРЕД сеткой, чтобы срабатывать задолго до конца */}
            <div ref={prefetchRef} aria-hidden className="h-1 w-full" />

            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {works.map((work, i) => (
                <WorkCard key={work.id} work={work} index={i} />
              ))}
            </div>

            {/* Fetch-маркер — прямо перед кнопкой, срабатывает последним */}
            <div ref={sentinelRef} aria-hidden className="h-1 w-full" />

            <LoadMoreButton
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
              hasMore={!!hasNextPage}
            />
          </>
        )}
      </div>
    </div >
  );
};