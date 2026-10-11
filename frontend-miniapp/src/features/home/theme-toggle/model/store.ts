import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeState {
  /** Текущая тема */
  isDark: boolean;
  /** true — пользователь переключал вручную; больше не синхронизируемся с Telegram */
  manual: boolean;

  /** Установить тему (используется кнопкой toggle → ставит manual = true) */
  setDark: (v: boolean) => void;
  /** Переключить (кнопка ThemeToggle) */
  toggle: () => void;
  /**
   * Применить тему из Telegram. Если manual === true — игнорируется.
   * Передавай undefined, если приложение открыто вне Telegram.
   */
  applyTelegram: (scheme: "light" | "dark" | undefined) => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: true,   // тёмная по умолчанию (и до первого sync, и вне Telegram)
      manual: false,

      setDark: (v) => set({ isDark: v, manual: true }),

      toggle: () => set((s) => ({ isDark: !s.isDark, manual: true })),

      applyTelegram: (scheme) => {
        if (get().manual) return;              // уважаем выбор пользователя
        if (scheme === "light") set({ isDark: false });
        else set({ isDark: true });            // 'dark' ИЛИ undefined (браузер) → тёмная
      },
    }),
    {
      name: "everart-theme",
      storage: createJSONStorage(() => localStorage),
      // Сохраняем только значения, методы persist сам отфильтрует
      partialize: (s) => ({ isDark: s.isDark, manual: s.manual }),
    },
  ),
);