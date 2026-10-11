import { memo, useCallback, useEffect, useState } from 'react';;
import { CalendarDays, Plus, X } from 'lucide-react';
import {
  addDays,
  BOOKING_HORIZON_DAYS,
  canBookToday,
  cn,
  formatBookingDate,
  formatBookingDates,
  haptic,
  isSameDay,
  isSlotPast,
  MAX_BOOKING_DATES,
  MONTHS_RU,
  parseBookingDate,
  parseBookingDates,
  startOfDay,
  TIME_SLOTS,
} from '@/shared/lib';
import { CalendarPanel } from './CalendarPanel';
import { TimeSlotsPanel } from './TimeSlotsPanel';

interface DateTimePickerProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

const LAST_SLOT_LABEL = TIME_SLOTS[TIME_SLOTS.length - 1];

/** «15 окт · 14:00» — компактный формат для чипа */
const formatChip = (raw: string): string => {
  const parsed = parseBookingDate(raw);
  if (!parsed) return raw;
  const d = parsed.date;
  const month = MONTHS_RU[d.getMonth()].slice(0, 3).toLowerCase();
  return `${d.getDate()} ${month} · ${parsed.time}`;
};

export const DateTimePicker = memo(({ value, onChange, error }: DateTimePickerProps) => {
  // Список подтверждённых пар (попадают в dates)
  const [selectedList, setSelectedList] = useState<string[]>(() =>
    parseBookingDates(value),
  );

  // Черновик — то, что сейчас выбрано в календаре/слотах
  const [draftDate, setDraftDate] = useState<Date | null>(null);
  const [draftTime, setDraftTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());

  // Внешний сброс (после успешной отправки форма обнуляется)
  useEffect(() => {
    if (!value) {
      setSelectedList([]);
      setDraftDate(null);
      setDraftTime(null);
    }
  }, [value]);

  const today = startOfDay(new Date());
  const maxDate = addDays(today, BOOKING_HORIZON_DAYS);
  const minDate = canBookToday() ? today : addDays(today, 1);

  const draftFormatted =
    draftDate && draftTime ? formatBookingDate(draftDate, draftTime) : null;
  const isDuplicate = draftFormatted ? selectedList.includes(draftFormatted) : false;
  const atLimit = selectedList.length >= MAX_BOOKING_DATES;
  const canAdd = Boolean(draftFormatted && !isDuplicate && !atLimit);

  const handleSelectDate = useCallback((d: Date) => {
    setDraftDate(d);
    setCurrentMonth(d);
    if (draftTime && isSameDay(d, today) && isSlotPast(draftTime)) {
      setDraftTime(null);
    }
  }, [draftTime, today]);

  const handleSelectTime = useCallback((t: string) => setDraftTime(t), []);

  const handleAdd = useCallback(() => {
    if (!canAdd || !draftFormatted) return;
    const next = [...selectedList, draftFormatted];
    setSelectedList(next);
    onChange(formatBookingDates(next));
    setDraftDate(null);
    setDraftTime(null);
    haptic.notify('success');
  }, [canAdd, draftFormatted, selectedList, onChange]);

  const handleRemove = useCallback((item: string) => {
    const next = selectedList.filter((x) => x !== item);
    setSelectedList(next);
    onChange(formatBookingDates(next));
    haptic.impact('light');
  }, [selectedList, onChange]);

  const handleChangeMonth = useCallback((d: Date) => setCurrentMonth(d), []);


  // Текст на кнопке «Добавить» зависит от состояния
  const addButtonLabel = atLimit
    ? `Максимум ${MAX_BOOKING_DATES} дат`
    : isDuplicate
      ? 'Уже добавлено'
      : draftTime
        ? 'Добавить дату'
        : 'Выбери время';

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-dim font-nunito">
        Дата и время
      </label>

      {/* Чипы с выбранными парами */}
      {selectedList.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {selectedList.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                aria-label={`Удалить ${item}`}
                className="group flex items-center gap-1.5 pl-2.5 pr-1.5 py-1
                           bg-blood/20 border border-gold/40 rounded-sm
                           text-gold text-xs font-nunito tracking-wide
                           transition-colors
                           hover:border-gold hover:bg-blood/30
                           active:border-gold active:bg-blood/30"
              >
                <CalendarDays className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                <span>{formatChip(item)}</span>
                <X
                  className="w-3 h-3 text-dim transition-colors group-hover:text-gold"
                  strokeWidth={1.5}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Календарь + слоты + кнопка «Добавить» */}
      <div
        className={cn(
          'rounded-sm bg-card border transition-colors',
          error && selectedList.length === 0 ? 'border-blood' : 'border-line',
        )}
      >
        <CalendarPanel
          currentMonth={currentMonth}
          selectedDate={draftDate}
          minDate={minDate}
          maxDate={maxDate}
          onSelectDate={handleSelectDate}
          onChangeMonth={handleChangeMonth}
        />

        {draftDate && (
          <div className="px-3 pt-3 pb-3 border-t border-line/60 flex flex-col gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-dim font-nunito mb-2">
                Время сеанса
              </p>
              <TimeSlotsPanel
                date={draftDate}
                selectedTime={draftTime}
                onSelectTime={handleSelectTime}
              />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!canAdd}
              className={cn(
                'w-full h-10 flex items-center justify-center gap-2 rounded-sm',
                'border text-xs tracking-widest uppercase font-nunito',
                'transition-all duration-300',
                canAdd
                  ? 'bg-gold/10 border-gold/60 text-gold hover:bg-gold/20 active:bg-gold/20'
                  : 'bg-surface border-line text-mute/50 cursor-not-allowed',
              )}
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              {addButtonLabel}
            </button>
          </div>
        )}
      </div>

      {error ? (
        <span className="text-blood text-[11px] font-nunito">{error}</span>
      ) : (
        <span className="text-mute text-[11px] font-nunito">
          До {MAX_BOOKING_DATES} вариантов. Сеансы до {LAST_SLOT_LABEL}, запись на{' '}
          {BOOKING_HORIZON_DAYS} дней вперёд.
        </span>
      )}
    </div>
  );
})

DateTimePicker.displayName = 'DateTimePicker';