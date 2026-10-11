import { Skeleton } from '@/shared/ui';
import { memo } from 'react';

interface SketchCardSkeletonProps {
  index?: number;
}

export const SketchCardSkeleton = memo(({ index = 0 }: SketchCardSkeletonProps) => (
  <div
    aria-hidden
    style={{ animationDelay: `${index * 60}ms` }}
    className="relative overflow-hidden rounded-sm bg-card
               border-2 border-line aspect-3/4"
  >
    {/* Заглушка фото */}
    <Skeleton className="absolute inset-0 rounded-none" />

    {/* Заглушка бейджа −% в левом верхнем */}
    <Skeleton className="absolute top-2 left-2 h-5 w-12 bg-line/70" />

    {/* Заглушка точки статуса в правом верхнем */}
    <Skeleton className="absolute top-2 right-2 w-2 h-2 rounded-full bg-line/70" />

    {/* Заглушки подписи и цен внизу */}
    <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1.5">
      <Skeleton className="h-3.5 w-3/4 bg-line/80" />
      <div className="flex gap-1.5">
        <Skeleton className="h-2.5 w-10 bg-line/50" />
        <Skeleton className="h-3 w-14 bg-line/70" />
      </div>
    </div>
  </div>
))
SketchCardSkeleton.displayName = 'SketchCardSkeleton';
