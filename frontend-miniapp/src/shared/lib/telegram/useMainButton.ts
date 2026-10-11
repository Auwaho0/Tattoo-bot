import { useEffect, useRef } from 'react';

/** Кровавый фон кнопки + основной текст — соответствует нашему bg-blood/text-main */
const MB_COLOR = '#8b0000';
const MB_TEXT_COLOR = '#e8e8ec';

interface Options {
  text: string;
  onClick: () => void;
  visible?: boolean;
  enabled?: boolean;
  progress?: boolean;
}

/**
 * Управление Telegram.WebApp.MainButton.
 * Автоматически: подписка на клик, окраска, show/hide, progress.
 * Вне Telegram — no-op (безопасно вызывать всегда).
 */
export const useMainButton = ({
  text,
  onClick,
  visible = true,
  enabled = true,
  progress = false,
}: Options): void => {
  const cbRef = useRef(onClick);
  cbRef.current = onClick;

  useEffect(() => {
    const mb = window.Telegram?.WebApp?.MainButton;
    if (!mb) return;

    const handler = () => cbRef.current();

    mb.setParams({ color: MB_COLOR, text_color: MB_TEXT_COLOR, text });
    mb.onClick(handler);

    if (!visible) {
      mb.hide();
    } else {
      if (enabled) mb.enable();
      else mb.disable();

      if (progress) mb.showProgress(true);
      else mb.hideProgress();

      mb.show();
    }

    return () => {
      mb.offClick(handler);
      mb.hide();
      mb.hideProgress();
    };
  }, [text, visible, enabled, progress]);
};