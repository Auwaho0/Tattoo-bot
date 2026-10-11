import { useEffect } from "react";
import { useTheme } from "@/features/home";

/**
 * Синхронизирует тему приложения с темой Telegram.
 *
 * Логика:
 *  - Первый запуск: если Telegram есть — берём colorScheme; если нет — тёмная.
 *  - Подписка на themeChanged: пользователь сменил тему в Telegram → обновились.
 *  - Если пользователь нажал toggle в приложении — manual = true, больше не слушаем.
 */
export const useTelegramTheme = (): void => {
  const applyTelegram = useTheme((s) => s.applyTelegram);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    // 1. Первичная синхронизация
    applyTelegram(tg?.colorScheme);

    // 2. Подписка на изменения (только если Telegram вообще есть)
    if (!tg?.onEvent) return;

    const handler = () => applyTelegram(tg.colorScheme);
    tg.onEvent("themeChanged", handler);

    return () => {
      tg.offEvent?.("themeChanged", handler );
    };
  }, [applyTelegram]);
};