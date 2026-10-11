import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download } from 'lucide-react';
import type { Sketch } from '@/entities/sketch';
import {
  buildPhotoFilename,
  cn,
  downloadImage,
  getPhotoUrl,
  haptic,
} from '@/shared/lib';
import { CloseButton, ImageLightbox } from '@/shared/ui';

interface SketchModalProps {
  sketch: Sketch;
  onClose: () => void;
}

export const SketchModal = memo(({ sketch, onClose }: SketchModalProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Esc + блокировка скролла.
  // Пока открыт lightbox — Esc закрывает только его, не модалку.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLightboxOpen) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, isLightboxOpen]);

  const photoUrl = getPhotoUrl(sketch.photo_file_id);
  const isFree = sketch.status === 'free';
  const discount = Math.round((1 - sketch.new_price / sketch.old_price) * 100);

  const handleDownload = async () => {
    if (isDownloading) return;
    haptic.impact('light');
    setIsDownloading(true);
    try {
      const filename = buildPhotoFilename('sketch', sketch.id, sketch.photo_file_id);
      await downloadImage(photoUrl, filename);
      haptic.notify('success');
    } catch (e) {
      console.error('[download]', e);
      haptic.notify('error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBook = () => {
    haptic.impact('medium');
    // TODO: отправка заявки через useBookSketchMutation
    console.log('Забронировать эскиз', sketch.id);
  };

  const handleOpenLightbox = () => {
    haptic.impact('light');
    setIsLightboxOpen(true);
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-500 flex items-center justify-center p-4
                   bg-black/85 backdrop-blur-sm
                   animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto
                     bg-card border border-gold/40 rounded-sm
                     shadow-[0_0_40px_rgba(187,166,141,0.15)]
                     animate-[slideUp_300ms_ease-out]"
        >
          <CloseButton onClick={onClose} />

          {/* Фото — тап открывает lightbox */}
          <div className="relative aspect-3/4 overflow-hidden bg-surface">
            <button
              type="button"
              onClick={handleOpenLightbox}
              aria-label="Открыть на весь экран"
              className="group block w-full h-full cursor-zoom-in"
            >
              <img
                src={photoUrl}
                alt={sketch.title}
                className="w-full h-full object-cover
                           transition-transform duration-500 ease-out
                           group-hover:scale-[1.03] group-active:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-black/0
                               group-hover:bg-black/10 group-active:bg-black/10
                               transition-colors duration-300" />
            </button>
            <div className="absolute inset-0 pointer-events-none
                            bg-linear-to-t from-card via-transparent to-transparent" />
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-gold text-xl font-nunito tracking-wider">
                {sketch.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isFree ? '#4ade80' : '#ef4444' }}
                />
                <span className="text-dim text-xs uppercase tracking-widest">
                  {isFree ? 'Свободен' : 'Продан'}
                </span>
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-mute text-[10px] uppercase tracking-widest mb-0.5">
                  Размер
                </dt>
                <dd className="text-main font-nunito">{sketch.size}</dd>
              </div>
              <div>
                <dt className="text-mute text-[10px] uppercase tracking-widest mb-0.5">
                  Место
                </dt>
                <dd className="text-main font-nunito">{sketch.placement}</dd>
              </div>
            </dl>

            <div className="flex items-baseline gap-3 pt-2 border-t border-line">
              <span className="text-mute text-sm line-through">
                {sketch.old_price.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-gold text-2xl font-nunito tracking-wide">
                {sketch.new_price.toLocaleString('ru-RU')} ₽
              </span>
              {discount > 0 && (
                <span className="px-2 py-0.5 bg-blood/80 border border-gold/30 rounded-sm
                                 text-white text-xs tracking-widest">
                  −{discount}%
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                disabled={!isFree}
                onClick={handleBook}
                className={cn(
                  'w-full h-12',
                  'bg-blood border border-gold/40 rounded-sm',
                  'text-white text-sm tracking-widest uppercase font-nunito',
                  'transition-all duration-300',
                  'hover:shadow-[0_0_25px_rgba(139,0,0,0.6)] hover:border-gold',
                  'disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-line anim-tapScale',
                )}
              >
                {isFree ? '💀 Забронировать' : '🔴 Продан'}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className={cn(
                  'w-full h-10 flex items-center justify-center gap-2',
                  'bg-surface border border-line rounded-sm',
                  'text-dim text-xs tracking-widest uppercase font-nunito',
                  'transition-all duration-300',
                  'hover:border-gold/60 hover:text-gold',
                  'disabled:opacity-50 disabled:cursor-wait anim-tapScale',
                )}
              >
                <Download
                  className={cn('w-4 h-4', isDownloading && 'animate-bounce')}
                  strokeWidth={1.5}
                />
                {isDownloading ? 'Скачиваем…' : 'Скачать фото'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <ImageLightbox
          src={photoUrl}
          alt={sketch.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>,
    document.body,
  );
})
SketchModal.displayName = 'SketchModal';