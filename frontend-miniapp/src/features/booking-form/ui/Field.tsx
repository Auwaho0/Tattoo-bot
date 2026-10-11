import { memo, type ChangeEvent, type FocusEvent } from 'react';
import { cn } from '@/shared/lib';

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  multiline?: boolean;
  inputMode?: 'text' | 'numeric';
  prefix?: string;
  hint?: string;
}

export const Field = memo(({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  multiline = false,
  inputMode = 'text',
  prefix,
  hint,
}: FieldProps) => {
  const id = `field-${name}`;
  const hasError = Boolean(error);

  const base = cn(
    'w-full px-4 py-3 rounded-sm text-sm font-nunito',
    'bg-card text-main placeholder:text-mute',
    'border transition-colors outline-none',
    hasError ? 'border-blood focus:border-blood' : 'border-line focus:border-gold',
    prefix && 'pl-8',
  );

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onChange(e.target.value);

  const handleBlur = (_: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onBlur?.();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] uppercase tracking-widest text-dim font-nunito"
      >
        {label}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold text-sm pointer-events-none">
            {prefix}
          </span>
        )}

        {multiline ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={handleInput}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={3}
            className={cn(base, 'resize-none')}
          />
        ) : (
          <input
            id={id}
            name={name}
            type="text"
            inputMode={inputMode}
            value={value}
            onChange={handleInput}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={base}
          />
        )}
      </div>

      {hasError ? (
        <span className="text-blood text-[11px] font-nunito">{error}</span>
      ) : hint ? (
        <span className="text-mute text-[11px] font-nunito">{hint}</span>
      ) : null}
    </div>
  );
})

Field.displayName = 'Field';