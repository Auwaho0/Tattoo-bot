import {
  lazy,
  memo,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/home';

const PortfolioPage = lazy(() =>
  import('@/pages/portfolio').then((m) => ({ default: m.PortfolioPage })),
);
const SketchesPage = lazy(() =>
  import('@/pages/sketches').then((m) => ({ default: m.SketchesPage })),
);
const TattooCarePage = lazy(() =>
  import('@/pages/tattooСare').then((m) => ({ default: m.TattooСare })),
);
const NotePage = lazy(() =>
  import('@/pages/note').then((m) => ({ default: m.NotePage })),
);

const PanelFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-app text-dim">
    Загрузка…
  </div>
);

interface PanelProps {
  path: string;
  Component: LazyExoticComponent<ComponentType>;
  isOpen: boolean;
}

/** memo — закрытые панели не ре-рендерятся при навигации */
const Panel = memo(({ path, Component, isOpen }: PanelProps) => {
  const [wasOpened, setWasOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setWasOpened(true);
  }, [isOpen]);

  return (
    <div
      className={`panel ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
      data-panel={path}
    >
      {wasOpened && (
        <Suspense fallback={<PanelFallback />}>
          <Component />
        </Suspense>
      )}
    </div>
  );
});
Panel.displayName = 'Panel';

const PANELS = [
  { path: '/portfolio', Component: PortfolioPage },
  { path: '/sketch', Component: SketchesPage },
  { path: '/tattoo-care', Component: TattooCarePage },
  { path: '/note', Component: NotePage },
] as const;

/** HomePage смонтирован вне AppContent → не ре-рендерится при смене роута */
const HomeShell = memo(() => <HomePage />);
HomeShell.displayName = 'HomeShell';

const AppContent = () => {
  const { pathname } = useLocation();

  return (
    <>
      <HomeShell />
      {PANELS.map((panel) => (
        <Panel
          key={panel.path}
          path={panel.path}
          Component={panel.Component}
          isOpen={pathname === panel.path}
        />
      ))}
    </>
  );
};

export const AppRoutes = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);