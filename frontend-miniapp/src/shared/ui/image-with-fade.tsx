import { memo, useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';
import { cn } from '@/shared/lib';

type ImageWithFadeProps = ImgHTMLAttributes<HTMLImageElement>;

/**
 * <img>, который плавно проявляется после загрузки.
 *
 * Принимает любой className — включая `transition-all`, `duration-*`,
 * hover-эффекты. Свои дефолтные transition-opacity/duration-500 ставятся
 * первыми, чтобы внешний className перебил их через tailwind-merge.
 *
 * Пока не загружено — принудительно opacity-0 (последним классом,
 * чтобы перебить базовый opacity-*).
 */
export const ImageWithFade = memo(({
  className,
  onLoad,
  ...rest
}: ImageWithFadeProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  return (
    <img
      {...rest}
      onLoad={handleLoad}
      className={cn(
        'transition-opacity duration-500 ease-out',
        className,
        !isLoaded && 'opacity-0',
      )}
    />
  );
});
ImageWithFade.displayName = 'ImageWithFade';