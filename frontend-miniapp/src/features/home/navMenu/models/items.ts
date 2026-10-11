import sketchLight from '@/assets/light/bg-sketch.png';
import sketchDark from '@/assets/dark/bg-sketch.png';

import portfolioLight from '@/assets/light/bg-portfolio.png';
import portfolioDark from '@/assets/dark/bg-portfolio.png';

import infoLight from '@/assets/light/bg-info.png';
import infoDark from '@/assets/dark/bg-info.png';

import bookingLight from '@/assets/dark/bg-booking.png';
import bookingDark from '@/assets/dark/bg-booking.png';

export type NavImage = {
  light: string;
  dark: string;
};

export const NAV_IMAGES: Record<string, NavImage> = {
  sketch: { light: sketchLight, dark: sketchDark },
  portfolio: { light: portfolioLight, dark: portfolioDark },
  "tattoo-care": { light: infoLight, dark: infoDark },
  note: { light: bookingLight, dark: bookingDark },
};

// fallback, если id не найден
export const DEFAULT_NAV_IMAGE: NavImage = { light: sketchLight, dark: sketchDark };