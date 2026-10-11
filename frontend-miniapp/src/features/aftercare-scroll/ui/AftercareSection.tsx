import { memo, useState, type CSSProperties, type ReactNode } from 'react';
import { ChevronDown, Clock, Droplets, Moon, Skull, AlertTriangle } from 'lucide-react';
import type { AftercareSection as SectionData, AftercareVariant } from '@/entities/aftercare';
import { cn, haptic } from '@/shared/lib';

interface Props {
  data: SectionData;
  defaultOpen?: boolean;
}

const ICONS: Record<string, ReactNode> = {
  care_24h: <Clock className="w-4 h-4" strokeWidth={1.5} />,
  care_week1: <Droplets className="w-4 h-4" strokeWidth={1.5} />,
  care_week2: <Moon className="w-4 h-4" strokeWidth={1.5} />,
  care_forbidden: <Skull className="w-4 h-4" strokeWidth={1.5} />,
  care_problem: <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />,
};

const VARIANT_STYLES: Record<AftercareVariant, {
  border: string;
  icon: string;
  title: string;
  bullet: string;
}> = {
  default: {
    border: 'border-line hover:border-gold/50',
    icon: 'text-gold',
    title: 'text-gold',
    bullet: 'bg-gold',
  },
  warning: {
    border: 'border-line hover:border-gold/50',
    icon: 'text-amber-500',
    title: 'text-amber-400',
    bullet: 'bg-amber-500',
  },
  danger: {
    border: 'border-line hover:border-gold/50',
    icon: 'text-blood',
    title: 'text-blood',
    bullet: 'bg-blood',
  },
};

export const AftercareSection = memo(({ data, defaultOpen = false }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const styles = VARIANT_STYLES[data.variant];
  const icon = ICONS[data.id] ?? <Skull className="w-4 h-4" strokeWidth={1.5} />;

  const toggle = () => {
    haptic.impact('light');
    setIsOpen((v) => !v);
  };

  return (
    <section
      className={cn(
        'relative rounded-md bg-card border transition-colors duration-300',

        styles.border,
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
            styles.icon,
          )}
        >
          {icon}
        </span>

        <span className="flex-1 min-w-0 flex flex-col">
          <span
            className={cn(
              'text-sm font-nunito tracking-wider uppercase',
              styles.title,
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
            'w-4 h-4 transition-transform  duration-500 ease-out shrink-0 text-gold',
            isOpen && 'rotate-180',
          )}
          strokeWidth={1.5}
        />
      </button>

      {/* Свиток: grid-rows 0fr → 1fr — плавно раскрывает контент по высоте */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-500 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          {/* Каскад элементов свитка: разделитель → пункты → финальный текст */}
          <div
            className={cn(
              'px-4 pb-4 flex flex-col gap-2.5 scroll-unroll',
              isOpen && 'is-open',
            )}
          >
            {/* Разделитель — тонкая золотая линия */}
            <div
              className="h-px bg-linear-to-r from-transparent via-gold/30 to-transparent scroll-item"
              style={{ '--i': 0 } as CSSProperties}
            />

            {data.items && (
              <ul className="flex flex-col gap-2 mt-1">
                {data.items.map((item, i) => (
                  <li
                    key={i}
                    className="scroll-item flex items-start gap-2.5 text-sm font-nunito text-dim leading-snug"
                    style={{ '--i': i + 1 } as CSSProperties}
                  >
                    <span
                      className={cn(
                        'mt-1.5 w-1 h-1 rounded-full shrink-0',
                        styles.bullet,
                      )}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {data.text && (
              <p
                className={cn(
                  'scroll-item mt-2 px-3 py-2.5 rounded-sm text-sm font-nunito leading-snug',
                  'bg-surface border border-line',
                  data.variant === 'warning' && 'border-amber-700/40 text-amber-400',
                  data.variant === 'danger' && 'border-blood/40 text-blood',
                )}
                style={{ '--i': (data.items?.length ?? 0) + 1 } as CSSProperties}
              >
                {data.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
})
AftercareSection.displayName = 'AftercareSection';