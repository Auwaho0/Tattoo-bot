import { memo, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronDown,
  Clock,
  Droplets,
  Info,
  Moon,
  Skull,
} from 'lucide-react';
import type {
  AftercareGroupVariant,
  AftercareSection as SectionData,
  AftercareVariant,
} from '@/entities/aftercare';
import { cn, haptic } from '@/shared/lib';

interface Props {
  data: SectionData;
  defaultOpen?: boolean;
}

/* --- Иконка секции (по id) --- */
const SECTION_ICONS: Record<string, ReactNode> = {
  care_before: <Clock className="w-4 h-4" strokeWidth={1.5} />,
  care_24h: <Clock className="w-4 h-4" strokeWidth={1.5} />,
  care_week1: <Droplets className="w-4 h-4" strokeWidth={1.5} />,
  care_week2: <Moon className="w-4 h-4" strokeWidth={1.5} />,
  care_problem: <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />,
};

/* --- Стили варианта секции (заголовок + иконка) --- */
const SECTION_STYLES: Record<AftercareVariant, { icon: string; title: string }> = {
  default: { icon: 'text-gold', title: 'text-gold' },
  warning: { icon: 'text-amber-500', title: 'text-amber-400' },
  danger: { icon: 'text-blood', title: 'text-blood' },
};

/* --- Стили варианта группы (иконка, заголовок, маркер пункта, фон заголовка) --- */
const GROUP_STYLES: Record<
  AftercareGroupVariant,
  { icon: ReactNode; iconColor: string; titleColor: string; bullet: string; border: string }
> = {
  forbidden: {
    icon: <Ban className="w-4 h-4" strokeWidth={1.5} />,
    iconColor: 'text-blood',
    titleColor: 'text-blood',
    bullet: 'bg-blood',
    border: 'border-blood/30',
  },
  required: {
    icon: <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />,
    iconColor: 'text-emerald-400',
    titleColor: 'text-emerald-400',
    bullet: 'bg-emerald-400',
    border: 'border-emerald-500/30',
  },
  info: {
    icon: <Info className="w-4 h-4" strokeWidth={1.5} />,
    iconColor: 'text-gold',
    titleColor: 'text-gold',
    bullet: 'bg-gold',
    border: 'border-gold/30',
  },
};

export const AftercareSection = memo(({ data, defaultOpen = false }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const sectionStyle = SECTION_STYLES[data.variant];
  const sectionIcon =
    SECTION_ICONS[data.id] ?? <Skull className="w-4 h-4" strokeWidth={1.5} />;

  // Сквозной счётчик для stagger — чтобы анимация шла от группы к группе
  // плавно, а не начиналась заново в каждой.
  const groupOffsets = useMemo(() => {
    let n = 0;
    return data.groups.map((g) => {
      const start = n;
      n += 1 + g.items.length; // 1 на заголовок группы + items
      return start;
    });
  }, [data.groups]);

  const toggle = () => {
    haptic.impact('light');
    setIsOpen((v) => !v);
  };

  return (
    <section
      className={cn(
        'relative rounded-md bg-card border transition-colors duration-300',
        'border-line hover:border-gold/50',
      )}
    >
      {/* Заголовок / кнопка раскрытия */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <span
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-sm shrink-0',
            'bg-surface border border-line',
            sectionStyle.icon,
          )}
        >
          {sectionIcon}
        </span>

        <span className="flex-1 min-w-0 flex flex-col">
          <span
            className={cn(
              'text-sm font-nunito tracking-wider uppercase',
              sectionStyle.title,
            )}
          >
            {data.title}
          </span>
          {data.subtitle && (
            <span className="text-[11px] text-mute font-nunito tracking-wide">
              {data.subtitle}
            </span>
          )}
        </span>

        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-500 ease-out shrink-0 text-gold',
            isOpen && 'rotate-180',
          )}
          strokeWidth={1.5}
        />
      </button>

      {/* Свиток */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-500 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'px-4 pb-4 flex flex-col gap-3 scroll-unroll',
              isOpen && 'is-open',
            )}
          >
            {/* Разделитель */}
            <div
              className="h-px bg-linear-to-r from-transparent via-gold/30 to-transparent scroll-item"
              style={{ '--i': 0 } as CSSProperties}
            />

            {/* Группы */}
            {data.groups.map((group, gi) => {
              const gs = GROUP_STYLES[group.variant];
              const startIdx = groupOffsets[gi] + 1; // +1 — после разделителя

              return (
                <div
                  key={group.id}
                  className="flex flex-col gap-2"
                >
                  {/* Заголовок группы */}
                  <div
                    className={cn(
                      'scroll-item flex items-center gap-2 pb-1',
                      'border-b',
                      gs.border,
                    )}
                    style={{ '--i': startIdx } as CSSProperties}
                  >
                    <span className={gs.iconColor}>{gs.icon}</span>
                    <span
                      className={cn(
                        'text-[11px] uppercase tracking-widest font-nunito',
                        gs.titleColor,
                      )}
                    >
                      {group.title}
                    </span>
                    {group.subtitle && (
                      <span className="text-[10px] text-mute font-nunito ml-1">
                        {group.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Пункты группы */}
                  <ul className="flex flex-col gap-2">
                    {group.items.map((item, i) => (
                      <li
                        key={i}
                        className="scroll-item flex items-start gap-2.5 text-sm font-nunito text-dim leading-snug"
                        style={{ '--i': startIdx + 1 + i } as CSSProperties}
                      >
                        <span
                          className={cn(
                            'mt-1.5 w-1 h-1 rounded-full shrink-0',
                            gs.bullet,
                          )}
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Финальный текст — для «Проблема?» */}
            {data.text && (
              <p
                className={cn(
                  'scroll-item mt-1 px-3 py-2.5 rounded-sm text-sm font-nunito leading-snug',
                  'bg-surface border border-line',
                  data.variant === 'warning' && 'border-amber-700/40 text-amber-400',
                  data.variant === 'danger' && 'border-blood/40 text-blood',
                )}
                style={
                  {
                    '--i': groupOffsets.length + data.text.length,
                  } as CSSProperties
                }
              >
                {data.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

AftercareSection.displayName = 'AftercareSection';