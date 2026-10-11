import { memo } from 'react';
import { useTheme } from '../model/store';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = memo(() => {
  const isDark = useTheme((s) => s.isDark);
  const toggle = useTheme((s) => s.toggle);

  return (
    <div className="flex items-center justify-between mt-2.5">
      <button
        onClick={toggle}
        className="flex z-10 items-center gap-1.5 px-3 py-1.5 rounded-full
                   text-xs font-medium cursor-pointer
                   bg-surface-2/90 text-gold-dim border border-line
                   hover:bg-surface-2
                   anim-tapScale anim-tapScaleDark"
        title="Переключить тему"
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-gold-dim" />
            <span>Тёмная тема</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-gold-dim" />
            <span>Светлая тема</span>
          </>
        )}
      </button>
    </div>
  );
})
ThemeToggle.displayName = 'ThemeToggle';
