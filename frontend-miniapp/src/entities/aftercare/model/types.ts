export type AftercareVariant = 'default' | 'warning' | 'danger';

/** Визуальный тип группы — задаёт цвет заголовка и маркеров */
export type AftercareGroupVariant = 'forbidden' | 'required' | 'info';

export interface AftercareGroup {
  /** Уникальный id группы в пределах секции — нужен как key */
  id: string;
  /** Заголовок группы: «НЕЛЬЗЯ», «НУЖНО», «ИНСТРУКЦИЯ», «ПЛЁНКА»… */
  title: string;
  /** Мелкий подзаголовок группы (опционально) */
  subtitle?: string;
  /** Стилевой вариант: красный/зелёный/золотой */
  variant: AftercareGroupVariant;
  /** Пункты группы */
  items: string[];
}

export interface AftercareSection {
  /** Уникальный id — используется как key и для hash-навигации */
  id: string;
  /** Заголовок раздела */
  title: string;
  /** Мелкий подзаголовок под заголовком (опционально) */
  subtitle?: string;
  /** Стилевой вариант секции */
  variant: AftercareVariant;
  /** Группы внутри секции */
  groups: AftercareGroup[];
  /** Произвольный текст в конце (для «Проблема?») */
  text?: string;
}