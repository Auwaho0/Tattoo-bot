import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  cn,
  daysInMonth,
  getMondayBasedWeekday,
  haptic,
  isAfter,
  isBefore,
  isSameDay,
  MONTHS_RU,
  startOfDay,
  startOfMonth,
  WEEKDAYS_SHORT_RU,
} from '@/shared/lib';
import { memo } from 'react';

interface CalendarPanelProps {
  currentMonth: Date;
  selectedDate: Date | null;
  minDate: Date;
  maxDate: Date;
  onSelectDate: (d: Date) => void;
  onChangeMonth: (d: Date) => void;
}

export const CalendarPanel =  memo(({
  currentMonth,
  selectedDate,
  minDate,
  maxDate,
  onSelectDate,
  onChangeMonth,
}: CalendarPanelProps) => {
  const today = startOfDay(new Date());

  const currentMonthStart = startOfMonth(currentMonth);
  const minMonthStart = startOfMonth(minDate);
  const maxMonthStart = startOfMonth(maxDate);

  const canGoPrev = isAfter(currentMonthStart, minMonthStart);
  const canGoNext = isBefore(currentMonthStart, maxMonthStart);

  const goPrev = () => {
    if (!canGoPrev) return;
    haptic.impact('light');
    onChangeMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const goNext = () => {
    if (!canGoNext) return;
    haptic.impact('light');
    onChangeMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  // Сетка: пустые ячейки для смещения + дни месяца
  const offset = getMondayBasedWeekday(currentMonthStart);
  const total = daysInMonth(currentMonth);
  const cells: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) {
    cells.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
  }

  return (
    <div>
      {/* Навигация по месяцам */}
      <div className="flex items-center justify-between px-2 py-2.5">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Предыдущий месяц"
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-sm',
            'transition-colors',
            canGoPrev
              ? 'text-gold hover:bg-surface'
              : 'text-mute/30 cursor-not-allowed',
          )}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <span className="text-sm font-nunito text-gold tracking-wider">
          {MONTHS_RU[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>

        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Следующий месяц"
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-sm',
            'transition-colors',
            canGoNext
              ? 'text-gold hover:bg-surface'
              : 'text-mute/30 cursor-not-allowed',
          )}
        >
          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Заголовки дней недели */}
      <div className="grid grid-cols-7 gap-0.5 px-2 pb-1">
        {WEEKDAYS_SHORT_RU.map((wd) => (
          <span
            key={wd}
            className="text-center text-[10px] uppercase tracking-widest text-mute font-nunito"
          >
            {wd}
          </span>
        ))}
      </div>

      {/* Дни */}
      <div className="grid grid-cols-7 gap-0.5 px-2 pb-3">
        {cells.map((day, i) => {
          if (!day) return <span key={i} aria-hidden />;

          const isDisabled = isBefore(day, minDate) || isAfter(day, maxDate);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isToday = isSameDay(day, today);

          return (
            <button
              key={i}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                haptic.impact('light');
                onSelectDate(day);
              }}
              aria-pressed={isSelected}
              className={cn(
                'relative aspect-square flex items-center justify-center',
                'text-sm font-nunito rounded-sm',
                'transition-colors duration-200',
                isDisabled && 'text-mute/40 cursor-not-allowed',
                !isDisabled && !isSelected && 'text-main hover:bg-surface',
                isSelected && 'bg-gold/40 text-main',
                !isSelected && isToday && 'border border-gold/40',
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
})


CalendarPanel.displayName = 'CalendarPanel';