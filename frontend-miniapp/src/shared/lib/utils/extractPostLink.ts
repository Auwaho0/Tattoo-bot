/**
 * Ищет в тексте ссылку на пост канала EverArt Tattoo.
 *
 * Поддерживает:
 *   https://t.me/EverArt_Tattoo/123
 *   t.me/EverArt_Tattoo/123
 *   http://t.me/...
 *
 * Возвращает:
 *   - text   — описание с вырезанной ссылкой (лишние пробелы схлопнуты)
 *   - link   — нормализованный https://t.me/... или null
 */

const POST_RE = /\b(?:https?:\/\/)?t\.me\/EverArt_Tattoo\/\d+\b/i;

export interface ExtractedPostLink {
  text: string;
  link: string | null;
}

export const extractPostLink = (raw: string | null | undefined): ExtractedPostLink => {
  const original = (raw ?? '').trim();
  const match = original.match(POST_RE);

  if (!match) return { text: original, link: null };

  const found = match[0];
  const link = found.startsWith('http') ? found : `https://${found}`;

  // Вырезаем ссылку и нормализуем пробелы (двойные, переводы строк)
  const text = original
    .replace(found, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();

  return { text, link };
};