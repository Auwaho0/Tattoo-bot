import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * Серая заглушка. Мерцание — встроенный `animate-pulse` Tailwind.
 * `aria-hidden` всегда — скринридер не должен читать заглушку.
 */
export const Skeleton = ({ className, ...rest }: SkeletonProps) => (
  <div
    aria-hidden
    className={cn(
      'rounded-sm bg-line animate-pulse',
      className,
    )}
    {...rest}
  />
);