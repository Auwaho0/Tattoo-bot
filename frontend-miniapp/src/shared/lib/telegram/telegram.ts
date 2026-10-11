

export const tg = (): TelegramWebApp | undefined => window.Telegram?.WebApp;

export const initTelegram = (): void => {
  const app = tg();
  if (!app) return;
  app.ready();
  app.expand();
};

export const colorsShema = (): void => {
  tg()?.colorScheme;
};



export const getInitData = (): string => tg()?.initData ?? '';