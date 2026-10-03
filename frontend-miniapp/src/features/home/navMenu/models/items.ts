import sketchLight from '@/assets/light/box.jpg';
import sketchDark from '@/assets/dark/bg-sketch.png';

import portfolioLight from '@/assets/light/box.jpg';
import portfolioDark from '@/assets/dark/bg-portfolio.png';

import infoLight from '@/assets/light/box.jpg';
import infoDark from '@/assets/dark/bg-info.png';

import bookingLight from '@/assets/light/box.jpg';
import bookingDark from '@/assets/dark/bg-booking.png';

export type NavImage = {
  light: string;
  dark: string;
};

export const NAV_IMAGES: Record<string, NavImage> = {
  sketch: { light: sketchLight, dark: sketchDark },
  portfolio: { light: portfolioLight, dark: portfolioDark },
  about: { light: infoLight, dark: infoDark },
  note: { light: bookingLight, dark: bookingDark },
};

// fallback, если id не найден
export const DEFAULT_NAV_IMAGE: NavImage = { light: sketchLight, dark: sketchDark };