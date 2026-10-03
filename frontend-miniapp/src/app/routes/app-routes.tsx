import { BrowserRouter, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { PortfolioPage } from '@/pages/portfolio';
import { SketchesPage } from '@/pages/sketches';
import { AboutPage } from '@/pages/about';
import { NotePage } from '@/pages/note';


const PANELS = [
  { path: '/portfolio', Component: PortfolioPage },
  { path: '/sketch', Component: SketchesPage },
  { path: '/about', Component: AboutPage },
  { path: '/note', Component: NotePage }
];

const AppContent = () => {
  const { pathname } = useLocation();

  return (
    <>
      <HomePage />

      {PANELS.map(({ path, Component }) => {
        const isOpen = pathname === path;
        return (
          <div
            key={path}
            className={`panel ${isOpen ? 'open' : ''}`}
            aria-hidden={!isOpen}
          >
            <Component />
          </div>
        );
      })}
    </>
  );
};

export const AppRoutes = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);