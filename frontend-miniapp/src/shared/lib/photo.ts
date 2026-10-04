/**
 * Превращает Telegram file_id в URL, который понимает <img>.
 * Реальный запрос уходит на наш бэкенд, токен остаётся на сервере.
 */
export const getPhotoUrl = (fileId: string): string =>
  `${import.meta.env.VITE_API_URL}/api/photo/${fileId}`;