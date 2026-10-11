/**
 * Храним последнюю отправленную заявку в localStorage.
 * Бэкенд не даёт списка заявок пользователя — поэтому помним только
 * факт отправки на этом устройстве.
 */

const KEY = 'everart-last-booking';
const WARNING_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 часа

interface LastBooking {
  id: number;
  at: number;
}

export const saveLastBooking = (id: number): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ id, at: Date.now() }));
  } catch {
    /* localStorage может быть отключён — не критично */
  }
};

export const getLastBooking = (): LastBooking | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastBooking;
    if (typeof parsed?.id !== 'number' || typeof parsed?.at !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
};

/** Была ли недавняя заявка (в пределах WARNING_WINDOW_MS) */
export const hasRecentBooking = (): boolean => {
  const last = getLastBooking();
  if (!last) return false;
  return Date.now() - last.at < WARNING_WINDOW_MS;
};