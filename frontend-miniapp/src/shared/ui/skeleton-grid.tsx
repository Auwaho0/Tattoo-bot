import type { ReactNode } from 'react';

interface SkeletonGridProps {
  /** Сколько карточек-заглушек нарисовать */
  count: number;
  /** Рендер одного элемента по индексу */
  renderItem: (index: number) => ReactNode;
}

/** Та же геометрия, что у реальной сетки: 2 колонки, gap-3, max-w-md. */
export const SkeletonGrid = ({ count, renderItem }: SkeletonGridProps) => (
  <div className="grid grid-cols-2 gap-3 w-full max-w-md">
    {Array.from({ length: count }, (_, i) => renderItem(i))}
  </div>
);