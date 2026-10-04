import { useEffect, useMemo, useRef, useState } from 'react';
import { useWorksQuery } from '@/entities/work';
import type { Work, SortOrder } from '@/entities/work';
import { WorkCard } from '@/widgets/work-grid';
import { useTheme } from '@/features/home';
import { PortfolioSort } from '@/features/portfolio/portfolio-sort';
import { LoadMoreButton } from '@/features/portfolio/load-more';
import { BackButton } from '@/shared/ui';

export const PortfolioPage = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('new');

  // Передаём order в хук — он сам сменит queryKey и перезагрузит первую страницу
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorksQuery(sortOrder);

  const isDark = useTheme((s) => s.isDark);

  // Склеиваем страницы в один массив — порядок уже правильный с бэкенда
  const works: Work[] = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const total = data?.pages[0]?.total ?? 0;

  // Авто-подгрузка при скролле
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
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

        {isLoading && (
          <div className="text-[#898989] py-8">Загрузка…</div>
        )}

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