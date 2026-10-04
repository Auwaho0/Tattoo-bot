import { useState } from 'react';
import type { Work } from '@/entities/work';
import { WorkModal } from './WorkModal';

import "./style.css"
import { getPhotoUrl } from '@/shared/lib';

interface WorkCardProps {
  work: Work;
  index: number;
}

export const WorkCard = ({ work, index }: WorkCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const photoUrl = getPhotoUrl(work.photo_file_id);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden rounded-sm bg-[#0d0d0d] border border-[#2a2a2a]
                   transition-all duration-500 hover:border-[#bba68d]/60 hover:shadow-[0_0_25px_rgba(187,166,141,0.15)]
                   text-left w-full"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Фото с эффектом «выхода из тьмы» */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={photoUrl}
            alt={work.title}
            loading="lazy"
            className="w-full h-full object-cover grayscale opacity-60
                       transition-all duration-700 ease-out
                       group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
          />

          {/* Градиент снизу — чтобы текст читался */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

          {/* Метка цены */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-[#0a0a0a]/80 backdrop-blur-sm
                          border border-[#bba68d]/30 rounded-sm">
            <span className="text-[#bba68d] text-xs font-nunito-san tracking-wider">
              {work.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        {/* Подпись */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-[#e8e8ec] text-sm font-nunito-san tracking-wide
                         truncate group-hover:text-[#bba68d] transition-colors">
            {work.title}
          </h3>
          <p className="text-[#898989] text-xs mt-0.5 truncate">
            {work.placement} · {work.size}
          </p>
        </div>

        {/* Тонкая золотая линия снизу при hover */}
        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#bba68d]
                        transition-all duration-500 group-hover:w-full" />
      </button>

      {isOpen && <WorkModal work={work} onClose={() => setIsOpen(false)} />}
    </>
  );
};