/**
 * Скачивает картинку по URL как файл.
 *
 * Почему fetch + Blob, а не <a download href>:
 * атрибут `download` игнорируется браузером для cross-origin URL
 * (а /api/photo живёт на другом домене, чем фронт). Blob-URL — свой,
 * для него `download` работает.
 */
export const downloadImage = async (
  url: string,
  filename: string,
): Promise<void> => {
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Освобождаем blob. Даём браузеру время подхватить загрузку,
  // иначе на Safari iOS файл может не успеть начать качаться.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
};

/**
 * Генерирует безопасное имя файла.
 * Telegram file_id расширения не содержит, поэтому дефолт .jpg.
 */
export const buildPhotoFilename = (
  prefix: string,
  id: number,
  fileId: string,
): string => {
  const match = fileId.match(/\.(jpe?g|png|webp|gif|heic)$/i);
  const ext = match?.[0] ?? '.jpg';
  return `everart-${prefix}-${id}${ext}`;
};