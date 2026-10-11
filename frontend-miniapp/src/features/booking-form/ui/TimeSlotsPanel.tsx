import {
  cn,
  haptic,
  isSameDay,
  isSlotPast,
  startOfDay,
  TIME_SLOTS,
} from '@/shared/lib';
import { memo } from 'react';

interface TimeSlotsPanelProps {
  date: Date;
  selectedTime: string | null;
  onSelectTime: (t: string) => void;
}

export const TimeSlotsPanel = memo(({
  date,
  selectedTime,
  onSelectTime,
}: TimeSlotsPanelProps) => {
  const isToday = isSameDay(date, startOfDay(new Date()));
  const now = new Date();

  return (
    <div className="grid grid-cols-3 gap-2">
      {TIME_SLOTS.map((slot) => {
        const disabled = isToday && isSlotPast(slot, now);
        const selected = selectedTime === slot;

        return (
          <button
            key={slot}
            type="button"
            disabled={disabled}
            onClick={() => {
              haptic.impact('light');
              onSelectTime(slot);
            }}
            aria-pressed={selected}
            className={cn(
              'h-10 rounded-sm text-sm font-nunito tracking-wider',
              'transition-colors duration-200',
              disabled && 'text-mute/40  cursor-not-allowed',
              !disabled && !selected &&
              'text-main border-line hover:border-gold/60 hover:text-gold',
              selected && 'bg-gold/40 text-main',
            )}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
})

TimeSlotsPanel.displayName = 'TimeSlotsPanel';