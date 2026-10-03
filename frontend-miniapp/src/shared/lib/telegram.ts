export const tg = (): TelegramWebApp | undefined => window.Telegram?.WebApp;

export const initTelegram = (): void => {
  const app = tg();
  if (!app) return;
  app.ready();
  app.expand();
  app.setHeaderColor('#0A0A0C');
  app.setBackgroundColor('#0A0A0C');
};

export const haptic = (type: 'light' | 'medium' | 'heavy' = 'light'): void => {
  tg()?.HapticFeedback.impactOccurred(type);
};

export const getInitData = (): string => tg()?.initData ?? '';