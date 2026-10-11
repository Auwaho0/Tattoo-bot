import bgLight from '@/assets/light/bg-light.png';
import bgDark from '@/assets/dark/bg-hero.png';
import { DualImage } from '@/shared/ui';
import { Hero, ThemeToggle, useTheme } from '@/features/home';
import { NavMenu } from '@/features/home/navMenu';
import { NAVITEMS } from '@/pages/home/model/navItems';

export const HomePage = () => {
  const isDark = useTheme((s) => s.isDark); // ← только для DualImage

  return (
    <main className="min-h-screen theme-transition flex justify-center
                     bg-app text-main">
      <div className="w-full max-w-md min-h-screen relative flex flex-col
                      bg-surface border-x border-line-soft shadow-2xl
                      lg:mt-4 theme-transition">
        <div className="relative h-70 px-2">
          <DualImage
            srcLight={bgLight}
            srcDark={bgDark}
            active={isDark}
            mask={[
              'linear-gradient(to bottom, black 55%, transparent 100%)',
              'linear-gradient(to right, black 85%, transparent 100%)',
            ].join(', ')}
          >
            <ThemeToggle />
            <Hero />
          </DualImage>
        </div>

        <div className="flex flex-col">
          {NAVITEMS.map(({ id, title, context }) => (
            <NavMenu key={id} id={id} title={title} context={context} />
          ))}
        </div>
      </div>
    </main>
  );
};