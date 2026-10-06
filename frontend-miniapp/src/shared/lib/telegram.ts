import { useTheme } from "@/features/home";
import { useEffect } from "react";



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

export const f = () => {
  const isDark = useTheme((s) => s.isDark);
  const toggle = useTheme((s) => s.toggle);




  useEffect(() => {
    console.log(colorsShema())
  }, []);

  return (isDark ? 'dark' : 'light')
}


export const getInitData = (): string => tg()?.initData ?? '';