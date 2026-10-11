import { useCallback, useMemo, useState } from 'react';
import { validateForm } from './validation';
import { EMPTY_FORM, type FormErrors, type FormValues } from './types';

export const useBookingForm = () => {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});

  const errors = useMemo(() => validateForm(values), [values]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const visibleErrors: FormErrors = useMemo(() => {
    const out: FormErrors = {};
    (Object.keys(errors) as (keyof FormValues)[]).forEach((key) => {
      if (touched[key]) out[key] = errors[key];
    });
    return out;
  }, [errors, touched]);

  const setField = useCallback(
    <K extends keyof FormValues>(field: K, value: FormValues[K]) =>
      setValues((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const touchField = useCallback(
    (field: keyof FormValues) =>
      setTouched((prev) => ({ ...prev, [field]: true })),
    [],
  );

  const markAllTouched = useCallback(
    () =>
      setTouched({
        name: true,
        size: true,
        placement: true,
        dates: true,
        budget: true,
      }),
    [],
  );

  const reset = useCallback(() => {
    setValues(EMPTY_FORM);
    setTouched({});
  }, []);

  return {
    values,
    errors,
    visibleErrors,
    isValid,
    setField,
    touchField,
    markAllTouched,
    reset,
  };
};