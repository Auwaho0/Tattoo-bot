import { Link } from 'react-router-dom';

interface BackButtonProps {
  isDark: boolean;
}

export const BackButton = ({ isDark }: BackButtonProps) => {
  return (
    <>
      <Link
        to="/"
        className={`flex z-10 w-20 items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border cursor-pointer ${isDark
          ? 'bg-[#181818]/90 text-[#a89681] border-[#2e2a25] hover:bg-[#222]'
          : 'bg-white/90 text-[#2c2825] border-[#e2ddd5] hover:bg-white'
          }`}
        title="Назад">
        ← Назад
      </Link>
    </>
  )
}