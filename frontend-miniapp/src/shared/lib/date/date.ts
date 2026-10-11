/* ---------------------------------------------------------------------------
   Работа с датами для пикера записи.
   Формат на бэкенде: "15.10.2026, 14:00" (укладывается в 256 символов `dates`).
--------------------------------------------------------------------------- */

export const TIME_SLOTS = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const BOOKING_HORIZON_DAYS = 60;
export const LAST_SLOT_HOUR = 20;

export const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
] as const;

export const WEEKDAYS_SHORT_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;

/* --- Базовые операции над Date --- */

export const startOfDay = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number): Date => {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
};

export const startOfMonth = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), 1);

export const daysInMonth = (d: Date): number =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const isBefore = (a: Date, b: Date): boolean =>
  startOfDay(a).getTime() < startOfDay(b).getTime();

export const isAfter = (a: Date, b: Date): boolean =>
  startOfDay(a).getTime() > startOfDay(b).getTime();

/* --- Логика записи --- */

/** Понедельник = 0, воскресенье = 6 */
export const getMondayBasedWeekday = (d: Date): number =>
  (d.getDay() + 6) % 7;

/** Можно ли забронировать сегодня (последний слот 20:00) */
export const canBookToday = (now: Date = new Date()): boolean =>
  now.getHours() < LAST_SLOT_HOUR;

/** Прошёл ли слот для сегодняшнего дня */
export const isSlotPast = (time: string, now: Date = new Date()): boolean => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
};

/* --- Форматирование --- */

/** "15 октября" */
export const formatDateHuman = (d: Date): string =>
  `${d.getDate()} ${MONTHS_RU[d.getMonth()].toLowerCase()}`;

/** "Чт, 15 октября" */
export const formatDateHumanWithWeekday = (d: Date): string =>
  `${WEEKDAYS_SHORT_RU[getMondayBasedWeekday(d)]}, ${formatDateHuman(d)}`;

/** Формат на бэкенд: "15.10.2026, 14:00" */
export const formatBookingDate = (d: Date, time: string): string =>
  `${String(d.getDate()).padStart(2, '0')}.` +
  `${String(d.getMonth() + 1).padStart(2, '0')}.` +
  `${d.getFullYear()}, ${time}`;

/** Обратный парсинг строки "15.10.2026, 14:00" */
export const parseBookingDate = (
  raw: string,
): { date: Date; time: string } | null => {
  const m = raw.match(/^(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}:\d{2})$/);
  if (!m) return null;
  const [, dd, mm, yyyy, time] = m;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (Number.isNaN(date.getTime())) return null;
  return { date, time };
};

/* ---------------------------------------------------------------------------
   Мультивыбор дат.
   Формат сериализации: "15.10.2026, 14:00; 17.10.2026, 12:00"
--------------------------------------------------------------------------- */

export const MAX_BOOKING_DATES = 5;

export const formatBookingDates = (list: string[]): string => list.join('; ');

export const parseBookingDates = (raw: string): string[] => {
  if (!raw) return [];
  return raw.split(';').map((s) => s.trim()).filter(Boolean);
};