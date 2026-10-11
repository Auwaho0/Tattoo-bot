import { useLocation } from 'react-router-dom';
import { BackButton, OrnamentLine } from '@/shared/ui';
import { BookingForm } from '@/features/booking-form';

export const NotePage = () => {
  const { pathname } = useLocation();
  const isActive = pathname === '/note';

  return (
    <div className="min-h-screen p-4 bg-surface theme-transition text-main">
      <div className="max-w-md mx-auto flex flex-col gap-4">
        <BackButton />

        <header className="mt-2 flex flex-col gap-1">
          <h1 className="text-2xl font-nunito text-gold tracking-wider">
            ЗАПИСЬ
          </h1>
          <p className="text-dim text-xs font-nunito">
            Заполни форму — мастер свяжется с тобой в Telegram
          </p>

          <OrnamentLine />
        </header>

        <BookingForm isActive={isActive} />
      </div>
    </div>
  );
};

