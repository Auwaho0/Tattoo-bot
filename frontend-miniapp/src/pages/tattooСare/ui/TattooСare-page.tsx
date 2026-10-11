import { BackButton, OrnamentLine } from '@/shared/ui';
import { AFTERCARE_SECTIONS } from '@/entities/aftercare';
import { AftercareSection } from '@/features/aftercare-scroll';

/**
 * Страница «Уход за тату» — разворачивающийся свиток.
 * Секции аккордеона живут в entities/aftercare, рендер — в features/aftercare-scroll.
 */
export const TattooСare = () => (
  <div className="min-h-screen p-4 bg-surface theme-transition text-main">
    <div className="max-w-md mx-auto flex flex-col gap-4">
      <BackButton />

      {/* Заголовок с орнаментом сверху */}
      <header className="mt-2 flex flex-col">

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-nunito text-gold tracking-[0.2em] uppercase">
            Уход за тату
          </h1>
          <p className="text-dim text-[11px] font-nunito tracking-[0.3em] uppercase">
            memento mori
          </p>
        </div>

        <OrnamentLine />
      </header>

      {/* Пять разворачивающихся свитков */}
      <div className="flex flex-col gap-3 mt-2">
        {AFTERCARE_SECTIONS.map((section) => (
          <AftercareSection
            key={section.id}
            data={section}
          />
        ))}
      </div>

    </div>
  </div>
);
