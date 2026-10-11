import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { haptic } from '@/shared/lib';
import { CloseButton } from './CloseButton';

interface ImageLightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

/**
 * Полноэкранный просмотр картинки.
 * Тап по фону / крестику или Esc — закрыть.
 * Зум — нативный браузерный (pinch на iOS, ctrl+scroll на десктопе).
 */
export const ImageLightbox = ({ src, alt = '', onClose }: ImageLightboxProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleClose = () => {
    haptic.impact('light');
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-1000 flex items-center justify-center
                 bg-black/95 backdrop-blur-sm
                 animate-[fadeIn_200ms_ease-out]"
      onClick={handleClose}
    >
      <CloseButton onClick={onClose} />

      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
        className="max-w-full max-h-full object-contain select-none
                   animate-[lightboxZoom_250ms_ease-out]"
      />
    </div>,
    document.body,
  );
};