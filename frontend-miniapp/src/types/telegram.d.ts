export { };

declare global {
  interface TelegramWebAppUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
  }

  interface TelegramWebApp {
    initData: string;
    showAlert: (message: string, callback?: () => void) => void;
    initDataUnsafe: { user?: TelegramWebAppUser; start_param?: string };
    ready: () => void;
    expand: () => void;
    close: () => void;
    colorScheme: 'light' | 'dark';
    themeParams: Record<string, string>;
    viewportHeight: number;
    viewportStableHeight: number;
    setHeaderColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
    enableClosingConfirmation: () => void;
    MainButton: {
      text: string; show: () => void; hide: () => void;
      setText: (t: string) => void;
      onClick: (cb: () => void) => void;
      offClick: (cb: () => void) => void;
      enable: () => void; disable: () => void;
      showProgress: (leaveActive?: boolean) => void;
      hideProgress: () => void;
    };
    BackButton: {
      show: () => void; hide: () => void;
      onClick: (cb: () => void) => void;
      offClick: (cb: () => void) => void;
    };
    HapticFeedback: {
      impactOccurred: (s: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
      notificationOccurred: (t: 'error' | 'success' | 'warning') => void;
      selectionChanged: () => void;
    };
  }

  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}