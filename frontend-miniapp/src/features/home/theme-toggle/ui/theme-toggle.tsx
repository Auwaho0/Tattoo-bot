import { useTheme } from '../model/store';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const isDark = useTheme((s) => s.isDark);
  const toggle = useTheme((s) => s.toggle);

  return (
    <div className="flex items-center  justify-between mt-2.5">
      <button
        onClick={toggle}
        className={`flex z-10 items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border cursor-pointer ${isDark
          ? 'bg-[#181818]/90 text-[#a89681] border-[#2e2a25] hover:bg-[#222]'
          : 'bg-white/90 text-[#2c2825] border-[#e2ddd5] hover:bg-white'
          }`}
        title="Переключить тему оформления"
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 font-sans text-[#a89681]" />
            <span>Тёмная тема</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-[#a89681]" />
            <span>Светлая тема</span>
          </>
        )}
      </button>
    </div>
  );
};