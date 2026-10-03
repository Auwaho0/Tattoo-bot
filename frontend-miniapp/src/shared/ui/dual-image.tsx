import { cn } from '@/shared/lib';

export interface DualImageProps {
  /** Источник, который виден при active=false */
  srcLight: string;
  /** Источник, который виден при active=true */
  srcDark: string;
  /** Флаг переключения (например, isDark) */
  active: boolean;
  /** alt для обеих картинок */
  alt?: string;
  /** Классы контейнера */
  className?: string;
  /** Классы для <img> (по умолчанию object-fill w-full h-full) */
  imgClassName?: string;
  /** Длительность кросс-фейда в мс (по умолчанию 300) */
  duration?: number;
  mask?: string;
  children?: React.ReactNode;
}

export const DualImage = ({
  srcLight,
  srcDark,
  active,
  alt = '',
  className,
  imgClassName,
  duration = 300,
  mask,
  children
}: DualImageProps) => {
  const baseImg = cn(
    'absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out',
    imgClassName,
  );

  const maskStyle = mask
    ? {
      maskImage: mask,
      WebkitMaskImage: mask,
      maskComposite: 'intersect',
      WebkitMaskComposite: 'source-in',
    }
    : {};

  return (
    <>
      <div
        aria-hidden="true"
        className={cn('absolute inset-0 w-full h-full pointer-events-none select-none ', className)}>


        <img
          src={srcLight}
          alt={alt}
          style={{ ...maskStyle, transitionDuration: `${duration}ms` }}
          className={cn(baseImg, active ? 'opacity-0' : 'opacity-100')}
        />
        <img
          src={srcDark}
          alt={alt}
          style={{ ...maskStyle, transitionDuration: `${duration}ms` }}
          className={cn(baseImg, active ? 'opacity-100' : 'opacity-0')}
        />
      </div>
      {children}
    </>
  );
};