import type { SortOrder } from '@/entities/work';

interface PortfolioSortProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

const OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'new', label: 'Новые' },
  { value: 'old', label: 'Старые' },
];

export const PortfolioSort = ({ value, onChange }: PortfolioSortProps) => {
  const activeIndex = OPTIONS.findIndex((o) => o.value === value);

  return (
    <div className="relative inline-flex items-center p-0.5
                    bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm
                    transition-colors duration-300
                    hover:border-[#bba68d]/40">

      <span
        aria-hidden
        className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)]
                   bg-[#1a1a1a] border border-[#bba68d]/40 rounded-sm
                   shadow-[0_0_12px_rgba(187,166,141,0.15)]
                   transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />

      {OPTIONS.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={`
              relative z-10 px-4 h-9 min-w-[92px]
              text-xs tracking-widest uppercase font-nunito-san
              transition-colors duration-300
              ${isActive ? 'text-[#bba68d]' : 'text-[#6e6e78] hover:text-[#bba68d]/70'}
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};