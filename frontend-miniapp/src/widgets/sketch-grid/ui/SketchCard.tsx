import { useState } from 'react';
import type { Sketch } from '@/entities/sketch';
import { getPhotoUrl } from '@/shared/lib';
import { SketchModal } from './SketchModal';

interface SketchCardProps {
  sketch: Sketch;
  index: number;
}

export const SketchCard = ({ sketch, index }: SketchCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const photoUrl = getPhotoUrl(sketch.photo_file_id);

  const isFree = sketch.status === 'free';
  const discount = Math.round(
    (1 - sketch.new_price / sketch.old_price) * 100,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden rounded-sm bg-[#0d0d0d]
                   border-2 border-[#3a2f20] hover:border-[#bba68d]/60
                   transition-all duration-500
                   hover:shadow-[0_0_25px_rgba(187,166,141,0.2)]
                   text-left w-full"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Фото */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={photoUrl}
            alt={sketch.title}
            loading="lazy"
            className="w-full h-full object-cover grayscale opacity-60
                       transition-all duration-700 ease-out
                       group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />

          {/* Бейдж скидки */}
          {discount > 0 && isFree && (
            <div className="absolute top-2 left-2 px-2 py-0.5
                            bg-[#8b0000]/90 backdrop-blur-sm
                            border border-[#bba68d]/30 rounded-sm
                            shadow-[0_0_10px_rgba(139,0,0,0.6)]">
              <span className="text-[#e8e8ec] text-xs font-nunito-san tracking-widest">
                −{discount}%
              </span>
            </div>
          )}

          {/* Статус */}
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full
                          shadow-[0_0_8px_currentColor]"
            style={{
              color: isFree ? '#4ade80' : '#ef4444',
              backgroundColor: isFree ? '#4ade80' : '#ef4444',
            }}
          />
        </div>

        {/* Подпись */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-[#e8e8ec] text-sm font-nunito-san tracking-wide
                         truncate group-hover:text-[#bba68d] transition-colors">
            {sketch.title}
          </h3>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-[#4a4a4a] text-xs line-through">
              {sketch.old_price.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-[#bba68d] text-sm font-nunito-san tracking-wide">
              {sketch.new_price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        {/* Золотая линия снизу */}
        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#bba68d]
                        transition-all duration-500 group-hover:w-full" />
      </button>

      {isOpen && <SketchModal sketch={sketch} onClose={() => setIsOpen(false)} />}
    </>
  );
};