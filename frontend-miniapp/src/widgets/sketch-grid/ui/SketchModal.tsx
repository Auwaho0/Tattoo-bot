import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Sketch } from '@/entities/sketch';
import { getPhotoUrl } from '@/shared/lib/photo';

interface SketchModalProps {
  sketch: Sketch;
  onClose: () => void;
}

export const SketchModal = ({ sketch, onClose }: SketchModalProps) => {
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

  const photoUrl = getPhotoUrl(sketch.photo_file_id);
  const isFree = sketch.status === 'free';
  const discount = Math.round((1 - sketch.new_price / sketch.old_price) * 100);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
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

        <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
          <img src={photoUrl} alt={sketch.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-[#bba68d] text-xl font-nunito-san tracking-wider">
              {sketch.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isFree ? '#4ade80' : '#ef4444' }} />
              <span className="text-[#898989] text-xs uppercase tracking-widest">
                {isFree ? 'Свободен' : 'Продан'}
              </span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#bba68d]/30 to-transparent" />

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[#4a4a4a] text-[10px] uppercase tracking-widest mb-0.5">
                Размер
              </dt>
              <dd className="text-[#e8e8ec] font-nunito-san">{sketch.size}</dd>
            </div>
            <div>
              <dt className="text-[#4a4a4a] text-[10px] uppercase tracking-widest mb-0.5">
                Место
              </dt>
              <dd className="text-[#e8e8ec] font-nunito-san">{sketch.placement}</dd>
            </div>
          </dl>

          {/* Цены */}
          <div className="flex items-baseline gap-3 pt-2 border-t border-[#2a2a2a]">
            <span className="text-[#4a4a4a] text-sm line-through">
              {sketch.old_price.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-[#bba68d] text-2xl font-nunito-san tracking-wide">
              {sketch.new_price.toLocaleString('ru-RU')} ₽
            </span>
            {discount > 0 && (
              <span className="px-2 py-0.5 bg-[#8b0000]/80 border border-[#bba68d]/30 rounded-sm
                               text-[#e8e8ec] text-xs tracking-widest">
                −{discount}%
              </span>
            )}
          </div>

          {/* Кнопка бронирования */}
          <button
            type="button"
            disabled={!isFree}
            onClick={() => {
              // TODO: отправка заявки через useBookSketchMutation
              console.log('Забронировать эскиз', sketch.id);
            }}
            className="w-full h-12 mt-2
                       bg-[#8b0000] border border-[#bba68d]/40 rounded-sm
                       text-[#e8e8ec] text-sm tracking-widest uppercase font-nunito-san
                       transition-all duration-300
                       hover:shadow-[0_0_25px_rgba(139,0,0,0.6)] hover:border-[#bba68d]
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#2a2a2a]"
          >
            {isFree ? '💀 Забронировать' : '🔴 Продан'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};