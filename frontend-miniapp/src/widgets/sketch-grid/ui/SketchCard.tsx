import { useState, memo } from 'react';
import type { Sketch } from '@/entities/sketch';
import { getPhotoUrl } from '@/shared/lib';
import { ImageWithFade } from '@/shared/ui';
import { SketchModal } from './SketchModal';

interface SketchCardProps {
  sketch: Sketch;
  index: number;
}

export const SketchCard = memo(({ sketch, index }: SketchCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const photoUrl = getPhotoUrl(sketch.photo_file_id);

  const isFree = sketch.status === 'free';
  const discount = Math.round((1 - sketch.new_price / sketch.old_price) * 100);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{ animationDelay: `${index * 60}ms` }}
        className="group relative overflow-hidden rounded-sm bg-card
                   border-2 border-line hover:border-gold/60
                   transition-all duration-500
                   hover:shadow-[0_0_25px_rgba(187,166,141,0.2)]
                   text-left w-full aspect-3/4"
      >
        <div className="relative aspect-3/4 overflow-hidden">
          <ImageWithFade
            src={photoUrl}
            alt={sketch.title}
            loading="lazy"
            draggable={false}
            className="w-full h-full object-cover grayscale opacity-60
                       transition-all duration-700 ease-out
                       group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
          />
          <div className="absolute inset-0 pointer-events-none
                          bg-linear-to-t from-surface via-surface/30 to-transparent" />

          {discount > 0 && isFree && (
            <div className="absolute top-2 left-2 px-2 py-0.5
                            bg-blood/90 backdrop-blur-sm
                            border border-gold/30 rounded-sm
                            shadow-[0_0_10px_rgba(139,0,0,0.6)]">
              <span className="text-main text-xs font-nunito tracking-widest">
                −{discount}%
              </span>
            </div>
          )}

          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
            style={{
              color: isFree ? '#4ade80' : '#ef4444',
              backgroundColor: isFree ? '#4ade80' : '#ef4444',
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
          <h3 className="text-main text-sm font-nunito tracking-wide truncate
                         group-hover:text-gold transition-colors">
            {sketch.title}
          </h3>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-mute text-xs line-through">
              {sketch.old_price.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-gold text-sm font-nunito tracking-wide">
              {sketch.new_price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-0 bg-gold
                        transition-all duration-500 group-hover:w-full" />
      </button>

      {isOpen && <SketchModal sketch={sketch} onClose={() => setIsOpen(false)} />}
    </>
  );
});

SketchCard.displayName = 'SketchCard';