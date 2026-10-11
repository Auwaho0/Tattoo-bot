export interface FormValues {
  name: string;
  size: string;
  placement: string;
  dates: string;
  budget: string; // храним строкой, чтобы работал пустой input
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export const EMPTY_FORM: FormValues = {
  name: '',
  size: '',
  placement: '',
  dates: '',
  budget: '',
};