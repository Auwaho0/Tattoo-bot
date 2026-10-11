import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useCreateBookingMutation } from '@/entities/booking';
import {
  cn,
  haptic,
  hasRecentBooking,
  isInsideTelegram,
  saveLastBooking,
  useMainButton,
} from '@/shared/lib';
import { useBookingForm } from '../model/useBookingForm';
import { Field } from './Field';
import { DateTimePicker } from './DateTimePicker';
import { BookingSuccess } from './BookingSuccess';
import { getTelegramUserName } from '@/shared/lib';

interface BookingFormProps {
  isActive: boolean;
}

export const BookingForm = ({ isActive }: BookingFormProps) => {
  const {
    values,
    errors,
    visibleErrors,
    setField,
    touchField,
    markAllTouched,
    reset,
  } = useBookingForm();

  const mutation = useCreateBookingMutation();
  const [successId, setSuccessId] = useState<number | null>(null);

  // Предупреждение о недавней заявке — показываем один раз на маунт
  const [showWarning, setShowWarning] = useState<boolean>(() => hasRecentBooking());

  // Сбрасываем экран успеха при уходе из панели
  useEffect(() => {
    if (!isActive) setSuccessId(null);
  }, [isActive]);

  const handleSubmit = () => {
    markAllTouched();

    if (Object.keys(errors).length > 0) {
      haptic.notify('error');
      return;
    }

    const budget = Number(values.budget.replace(/\s/g, ''));

    mutation.mutate(
      {
        name: values.name.trim(),
        size: values.size.trim(),
        placement: values.placement.trim(),
        dates: values.dates.trim(),
        budget,
        photo_file_id: null,
        user_id: `@${getTelegramUserName()}`,
      },
      {
        onSuccess: (res) => {
          haptic.notify('success');
          saveLastBooking(res.id);
          setSuccessId(res.id);
          reset();
        },
        onError: () => {
          haptic.notify('error');
        },
      },
    );
  };

  // В BookingForm
  const handleName = useCallback((v: string) => setField('name', v), [setField]);
  const handleSize = useCallback((v: string) => setField('size', v), [setField]);
  const handlePlacement = useCallback((v: string) => setField('placement', v), [setField]);
  const handleDates = useCallback((v: string) => setField('dates', v), [setField]);
  const handleBudget = useCallback((v: string) => setField('budget', v), [setField]);

  const blurName = useCallback(() => touchField('name'), [touchField]);
  const blurSize = useCallback(() => touchField('size'), [touchField]);
  const blurPlacement = useCallback(() => touchField('placement'), [touchField]);
  const blurBudget = useCallback(() => touchField('budget'), [touchField]);

  const showNativeButton = !isInsideTelegram();

  useMainButton({
    text: 'Отправить заявку',
    onClick: handleSubmit,
    visible: isActive && successId === null,
    enabled: !mutation.isPending,
    progress: mutation.isPending,
  });

  if (successId !== null) {
    return <BookingSuccess bookingId={successId} />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-4 pb-24"
    >
      {showWarning && (
        <div
          className="flex items-start gap-3 px-3 py-3 rounded-sm
                     bg-amber-950/30 border border-amber-700/40
                     text-amber-400 text-xs font-nunito"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="flex-1 leading-snug">
            У тебя уже была заявка недавно. Хочешь отправить ещё одну?
          </p>
          <button
            type="button"
            onClick={() => setShowWarning(false)}
            aria-label="Скрыть"
            className="text-amber-400/70 hover:text-amber-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      )}

      <Field
        label="Имя"
        name="name"
        value={values.name}
        onChange={handleName}
        onBlur={blurName}
        error={visibleErrors.name}
        placeholder="Как к тебе обращаться?"
      />

      <Field
        label="Размер"
        name="size"
        value={values.size}
        onChange={handleSize}
        onBlur={blurSize}
        error={visibleErrors.size}
        placeholder="например, 15×20 см"
      />

      <Field
        label="Место"
        name="placement"
        value={values.placement}
        onChange={handlePlacement}
        onBlur={blurPlacement}
        error={visibleErrors.placement}
        placeholder="предплечье, спина, бедро…"
      />

      <DateTimePicker
        value={values.dates}
        onChange={handleDates}
        error={visibleErrors.dates}
      />

      <Field
        label="Бюджет"
        name="budget"
        value={values.budget}
        onChange={handleBudget}
        onBlur={blurBudget}
        error={visibleErrors.budget}
        placeholder="20000"
        inputMode="numeric"
        prefix="₽"
        hint="Примерная сумма, которую готов вложить"
      />

      <p className="text-mute text-[11px] font-nunito leading-relaxed">
        Референс можно прислать мастеру в Telegram после отправки заявки.
      </p>

      {mutation.isError && (
        <div className="text-blood text-sm font-nunito text-center py-2">
          Не удалось отправить. Попробуй ещё раз.
        </div>
      )}

      {showNativeButton && (
        <button
          type="submit"
          disabled={mutation.isPending}
          className={cn(
            'mt-2 h-12 rounded-sm',
            'bg-blood border border-gold/40',
            'text-main text-sm tracking-widest uppercase font-nunito',
            'transition-all duration-300',
            'hover:shadow-[0_0_25px_rgba(139,0,0,0.6)] hover:border-gold',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          {mutation.isPending ? 'Отправляем…' : 'Отправить заявку'}
        </button>
      )}
    </form>
  );
};