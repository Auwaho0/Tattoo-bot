import { Skeleton } from '@/shared/ui';
import { memo } from 'react';

interface WorkCardSkeletonProps {
  /** Лёгкая каскадная задержка при появлении группы */
  index?: number;
}

export const WorkCardSkeleton = memo(({ index = 0 }: WorkCardSkeletonProps) => (
  <div
    aria-hidden
    style={{ animationDelay: `${index * 60}ms` }}
    className="relative overflow-hidden rounded-sm bg-card
               border border-line aspect-3/4"
  >
    {/* Заглушка фото */}
    <Skeleton className="absolute inset-0 rounded-none" />

    {/* Заглушка бейджа цены в правом верхнем углу */}
    <Skeleton className="absolute top-2 right-2 h-6 w-16 bg-line/70" />

    {/* Заглушки подписи — как у настоящей карточки */}
    <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1.5">
      <Skeleton className="h-3.5 w-3/4 bg-line/80" />
      <Skeleton className="h-2.5 w-1/2 bg-line/60" />
    </div>
  </div>
))
WorkCardSkeleton.displayName = 'WorkCardSkeleton';