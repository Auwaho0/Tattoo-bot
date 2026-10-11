import type { MouseEvent } from 'react';
import { cn, haptic } from '@/shared/lib';

interface CloseButtonProps {
  /** Обработчик закрытия. Вызывается после haptic-отклика. */
  onClick: () => void;
  /** Размер: 'sm' (w-8 h-8, для модалок) | 'md' (w-10 h-10, для лайтбокса). */
  size?: 'sm' | 'md';
  /** Дополнительные классы для позиционирования / переопределения */
  className?: string;
  /** Отключить haptic (например, если компонент не про тач) */
  haptic?: boolean;
  /** Размер иконки в пикселях. По умолчанию — 20 для md, 16 для sm. */
  iconSize?: number;
}

/**
 * Круглая/скруглённая кнопка закрытия.
 * Используется в модалках, лайтбоксе, шторках.
 *
 * Клик внутри кнопки не всплывает — родительский onClick (например, фон
 * модалки) не сработает.
 */
export const CloseButton = ({
  onClick,
  size = 'sm',
  className,
  haptic: withHaptic = true,
  iconSize,
}: CloseButtonProps) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (withHaptic) haptic.impact('light');
    onClick();
  };

  const dimensionClass = size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
  const actualIconSize = iconSize ?? (size === 'md' ? 20 : 16);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Закрыть"
      className={cn(
        'absolute top-3 right-3 z-10 flex items-center justify-center',
        'bg-surface/80 backdrop-blur-sm border border-line',
        'text-gold hover:border-gold hover:text-main transition-colors',
        'cursor-pointer anim-tapScale',
        size === 'md' ? 'rounded-full' : 'rounded-sm',
        dimensionClass,
        className,
      )}
    >
      <span
        aria-hidden
        style={{ fontSize: actualIconSize, lineHeight: 1 }}
      >
        ✕
      </span>
    </button>
  );
};