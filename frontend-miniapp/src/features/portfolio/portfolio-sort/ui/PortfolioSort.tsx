import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { haptic } from '@/shared/lib';
import type { SortOrder } from '@/entities/work';

/** Ширина одного слота. Индикатор + кнопки используют одно и то же значение. */
const SLOT_WIDTH = 92;

interface PortfolioSortProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

const OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'new', label: 'Новые' },
  { value: 'old', label: 'Старые' },
];

export const PortfolioSort = memo(({ value, onChange }: PortfolioSortProps) => {
  const activeIndex = OPTIONS.findIndex((o) => o.value === value);

  // Ключ для вспышки-призрака. Меняется на каждый переход,
  // чтобы <span key={glowKey}> ре-маунтился и перезапускал CSS-анимацию.
  const [glowKey, setGlowKey] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // На первом рендере вспышку не запускаем — иначе она играет
    // каждый раз при открытии панели портфолио.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setGlowKey((k) => k + 1);
  }, [activeIndex]);

  const handleChange = useCallback(
    (next: SortOrder) => {
      if (next === value) return;
      haptic.impact('light');
      onChange(next);
    },
    [value, onChange],
  );

  return (
    <div
      role="tablist"
      aria-label="Порядок работ"
      className="relative inline-flex items-center p-0.5
                 bg-surface border border-line rounded-sm
                 hover:border-gold/40 transition-colors"
    >
      {/* Слайд-индикатор — стабильный элемент, едет через transform-transition */}
      <span
        aria-hidden
        className="sort-indicator absolute top-0.5 bottom-0.5 rounded-sm
                   bg-surface-2 border border-gold/40 pointer-events-none"
        style={{
          left: 2,
          width: SLOT_WIDTH,
          transform: `translateX(${activeIndex * SLOT_WIDTH}px)`,
        }}
      />

      {/* Вспышка-призрак — ре-маунтится на каждый переход, играет один раз */}
      <span
        aria-hidden
        key={glowKey}
        className="sort-glow absolute top-0.5 bottom-0.5 rounded-sm
                   border border-gold/60 pointer-events-none"
        style={{
          left: 2,
          width: SLOT_WIDTH,
          transform: `translateX(${activeIndex * SLOT_WIDTH}px)`,
        }}
      />

      {OPTIONS.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleChange(opt.value)}
            style={{ width: SLOT_WIDTH }}
            className={`relative z-10 h-9
              text-xs tracking-widest uppercase font-nunito
              transition-colors duration-300
              ${isActive ? 'text-gold' : 'text-dim hover:text-gold/70'}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
})
PortfolioSort.displayName = 'PortfolioSort';