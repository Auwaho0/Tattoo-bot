import type { FormErrors, FormValues } from './types';

export const validateForm = (v: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!v.name.trim()) errors.name = 'Как тебя зовут?';
  if (!v.size.trim()) errors.size = 'Укажи примерный размер';
  if (!v.placement.trim()) errors.placement = 'Куда хочешь набить?';
  if (!v.dates.trim()) errors.dates = 'Выбери дату и время';

  const trimmed = v.budget.trim();
  if (!trimmed) {
    errors.budget = 'Укажи бюджет';
  } else {
    const n = Number(trimmed.replace(/\s/g, ''));
    if (!Number.isFinite(n) || n < 0) {
      errors.budget = 'Введи положительное число';
    }
  }

  return errors;
};