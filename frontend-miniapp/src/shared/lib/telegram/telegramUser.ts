import { tg } from './telegram';

/**
 * Telegram ID пользователя.
 * Вне Telegram (браузер, отладка) возвращаем 'web' — так backend не отвергнет
 * запрос (в схеме user_id min_length=1).
 */
export const getTelegramUserId = (): string => {
  const id = tg()?.initDataUnsafe?.user?.id;
  return id != null ? String(id) : 'web';
};

export const getTelegramUserName = (): string => {
  const username = tg()?.initDataUnsafe?.user?.username;
  return username != null ? String(username) : 'web';
};


/** true, если приложение открыто внутри Telegram WebApp */
export const isInsideTelegram = (): boolean =>
  typeof window !== 'undefined' && !!window.Telegram?.WebApp;