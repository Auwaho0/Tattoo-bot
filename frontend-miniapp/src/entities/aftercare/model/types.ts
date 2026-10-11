export type AftercareVariant = 'default' | 'warning' | 'danger';

export interface AftercareSection {
  /** Уникальный id — используется как ключ и для hash-навигации */
  id: string;
  /** Заголовок раздела */
  title: string;
  /** Мелкий подзаголовок под заголовком (опционально) */
  subtitle?: string;
  /** Список пунктов. Если передан — рендерится как чек-лист */
  items?: string[];
  /** Произвольный текст (вместо/после списка). Для «Проблема?» */
  text?: string;
  /** Стилевой вариант — влияет на цвет иконки и акцентов */
  variant: AftercareVariant;
}