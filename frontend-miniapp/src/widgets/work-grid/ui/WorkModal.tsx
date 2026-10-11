import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download } from 'lucide-react';
import type { Work } from '@/entities/work';
import { extractPostLink } from '@/shared/lib';
import {
  buildPhotoFilename,
  cn,
  downloadImage,
  getPhotoUrl,
  haptic,
} from '@/shared/lib';
import { CloseButton, ImageLightbox } from '@/shared/ui';
import './style.css';

interface WorkModalProps {
  work: Work;
  onClose: () => void;
}

export const WorkModal = memo(({ work, onClose }: WorkModalProps) => {
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

  const photoUrl = getPhotoUrl(work.photo_file_id);

  const { text: descriptionText, link: postLink } = extractPostLink(work.description);

  const handleDownload = async () => {
    if (isDownloading) return;
    haptic.impact('light');
    setIsDownloading(true);
    try {
      const filename = buildPhotoFilename('work', work.id, work.photo_file_id);
      await downloadImage(photoUrl, filename);
      haptic.notify('success');
    } catch (e) {
      console.error('[download]', e);
      haptic.notify('error');
    } finally {
      setIsDownloading(false);
    }
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
          {/* Кнопка закрытия */}
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
                alt={work.title}
                className="w-full h-full object-cover
                           transition-transform duration-500 ease-out
                           group-hover:scale-[1.03] group-active:scale-[1.03]"
              />
              <span
                className="absolute inset-0 bg-black/0
                           group-hover:bg-black/10 group-active:bg-black/10
                           transition-colors duration-300"
              />
            </button>
            <div className="absolute inset-0 pointer-events-none
                            bg-linear-to-t from-card via-transparent to-transparent" />
          </div>

          {/* Информация */}
          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-gold text-xl font-nunito tracking-wider">
                {work.title}
              </h2>
              {descriptionText && (
                <p className="text-dim text-sm mt-1 font-nunito whitespace-pre-line">
                  {descriptionText}
                </p>
              )}

              {postLink && (
                <a
                  href={postLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => haptic.impact('light')}
                  className="inline-flex items-center gap-1.5 mt-2
                             text-dim text-xs uppercase tracking-widest
                             font-nunito
                             transition-colors
                             hover:border-gold hover:text-main"
                >
                  Читать пост →
                </a>
              )}

            </div>

            {/* Разделитель */}
            <div className="h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />

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
            <p className="text-mute text-xs tracking-widest uppercase text-center pt-2">
              {new Date(work.created_at).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>

            {/* Кнопка скачивания */}
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

      {isLightboxOpen && (
        <ImageLightbox
          src={photoUrl}
          alt={work.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>,
    document.body,
  );
})
WorkModal.displayName = 'WorkModal';


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
    <dt className="text-mute text-[10px] uppercase tracking-widest mb-0.5">
      {label}
    </dt>
    <dd className={highlight ? 'text-gold font-nunito tracking-wide' : 'text-main font-nunito'}>
      {value}
    </dd>
  </div>
);