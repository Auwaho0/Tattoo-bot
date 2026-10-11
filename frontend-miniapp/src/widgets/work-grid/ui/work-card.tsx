import { useState, memo } from 'react';
import type { Work } from '@/entities/work';
import { WorkModal } from './WorkModal';
import { getPhotoUrl } from '@/shared/lib';
import { ImageWithFade } from '@/shared/ui';
import './style.css';

interface WorkCardProps {
  work: Work;
  index: number;
}

export const WorkCard = memo(({ work, index }: WorkCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const photoUrl = getPhotoUrl(work.photo_file_id);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{ animationDelay: `${index * 60}ms` }}
        className="work-card group relative overflow-hidden rounded-sm bg-card
                   border border-line text-left w-full aspect-3/4
                   touch-manipulation select-none
                   transition-all duration-300 ease-out
                   hover:border-gold/60
                   hover:shadow-[0_0_25px_rgba(187,166,141,0.15)]
                   active:border-gold/80
                   active:shadow-[0_0_30px_rgba(187,166,141,0.25)]
                   active:scale-[0.97]"
      >
        <div className="relative aspect-3/4 overflow-hidden">
          <ImageWithFade
            src={photoUrl}
            alt={work.title}
            loading="lazy"
            draggable={false}
            className="w-full h-full object-cover grayscale opacity-60
                       transition-all duration-500 ease-out
                       group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105
                       group-active:grayscale-0 group-active:opacity-100 group-active:scale-105"
          />

          <div className="absolute inset-0 pointer-events-none
                          bg-linear-to-t from-surface via-surface/40 to-transparent" />

          <div className="absolute top-2 right-2 px-2 py-1 bg-surface/80 backdrop-blur-sm
                          border border-gold/30 rounded-sm">
            <span className="text-gold text-xs font-nunito tracking-wider">
              {work.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
          <h3 className="text-main text-sm font-nunito tracking-wide truncate
                         transition-colors duration-300
                         group-hover:text-gold group-active:text-gold">
            {work.title}
          </h3>
          <p className="text-dim text-xs mt-0.5 truncate">
            {work.placement} · {work.size}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-0 bg-gold
                        transition-all duration-500
                        group-hover:w-full group-active:w-full" />
      </button>

      {isOpen && <WorkModal work={work} onClose={() => setIsOpen(false)} />}
    </>
  );
});

WorkCard.displayName = 'WorkCard';