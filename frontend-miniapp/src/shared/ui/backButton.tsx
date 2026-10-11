import { Link } from 'react-router-dom';

export const BackButton = () => (
  <Link
    to="/"
    className="flex z-10 w-20 items-center gap-1.5 px-3 py-1.5 rounded-full
               text-xs font-medium cursor-pointer
               bg-surface-2/90 text-gold-dim border border-line
               hover:bg-surface-2 transition-colors
               anim-tapScale anim-tapScaleDarkanim-tapScale anim-tapScaleDark"

  >
    ← Назад
  </Link>
);