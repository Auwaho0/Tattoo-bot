import { useEffect, useState } from 'react';
import type { TelegramUser } from '../types/index';

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      setIsReady(true);
      return;
    }

    tg.ready();
    tg.expand();

    if (tg.initDataUnsafe?.user) {
      setUser(tg.initDataUnsafe.user);
    }

    setIsReady(true);
  }, []);

  const close = () => window.Telegram?.WebApp?.close();
  const showAlert = (message: string) => window.Telegram?.WebApp?.showAlert(message);
  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type);
  };

  return { user, isReady, close, showAlert, hapticFeedback };
}