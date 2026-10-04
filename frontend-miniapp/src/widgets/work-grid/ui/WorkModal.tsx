import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Work } from '@/entities/work';
import "./style.css"

interface WorkModalProps {
  work: Work;
  onClose: () => void;
}

export const WorkModal = ({ work, onClose }: WorkModalProps) => {
  // Закрытие по Esc + блокировка скролла
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const photoUrl = work.photo_file_id;

  return createPortal(
    <div
      className="fixed inset-0 z-500 flex items-center justify-center p-4
                 bg-black/85 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto
                   bg-[#0d0d0d] border border-[#bba68d]/40 rounded-sm
                   shadow-[0_0_40px_rgba(187,166,141,0.15)]
                   animate-[slideUp_300ms_ease-out]"
      >
        {/* Кнопка закрытия */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center
                     bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#2a2a2a] rounded-sm
                     text-[#bba68d] hover:border-[#bba68d] hover:text-[#e8e8ec]
                     transition-colors"
        >
          ✕
        </button>

        {/* Фото */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
          <img
            src={photoUrl}
            alt={work.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
        </div>

        {/* Информация */}
        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-[#bba68d] text-xl font-nunito-san tracking-wider">
              {work.title}
            </h2>
            {work.description && (
              <p className="text-[#898989] text-sm mt-1 font-nunito-san">
                {work.description}
              </p>
            )}
          </div>

          {/* Разделитель */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#bba68d]/30 to-transparent" />

          {/* Характеристики */}
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow label="Размер" value={work.size} />
            <InfoRow label="Место" value={work.placement} />
            <InfoRow label="Сеанс" value={work.duration} />
            <InfoRow
              label="Стоимость"
              value={`${work.price.toLocaleString('ru-RU')} ₽`}
              highlight
            />
          </dl>

          {/* Дата */}
          <p className="text-[#4a4a4a] text-xs tracking-widest uppercase text-center pt-2">
            {new Date(work.created_at).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const InfoRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex flex-col">
    <dt className="text-[#4a4a4a] text-[10px] uppercase tracking-widest mb-0.5">
      {label}
    </dt>
    <dd
      className={
        highlight
          ? 'text-[#bba68d] font-nunito-san tracking-wide'
          : 'text-[#e8e8ec] font-nunito-san'
      }
    >
      {value}
    </dd>
  </div>
);