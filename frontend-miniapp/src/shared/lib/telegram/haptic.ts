type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotifyType = 'error' | 'success' | 'warning';

const getTg = () => (typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined);

/**
 * Безопасная обёртка над Telegram.WebApp.HapticFeedback.
 * Если открыто вне Telegram — молча ничего не делает.
 */
export const haptic = {
  impact(style: ImpactStyle = 'light') {
    try {
      getTg()?.HapticFeedback?.impactOccurred(style);
    } catch {
      /* noop */
    }
  },
  notify(type: NotifyType) {
    try {
      getTg()?.HapticFeedback?.notificationOccurred(type);
    } catch {
      /* noop */
    }
  },
  selection() {
    try {
      getTg()?.HapticFeedback?.selectionChanged();
    } catch {
      /* noop */
    }
  },
};