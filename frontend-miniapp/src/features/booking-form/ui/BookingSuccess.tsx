import { Link } from 'react-router-dom';

interface Props {
  bookingId: number;
}

export const BookingSuccess = ({ bookingId }: Props) => (
  <div className="flex flex-col items-center text-center gap-5 py-12 px-4
                  animate-[fadeIn_400ms_ease-out]">
    <div className="w-16 h-16 flex items-center justify-center rounded-full
                    border border-gold/40 bg-card
                    shadow-[0_0_30px_rgba(187,166,141,0.25)]">
      <span className="text-2xl">🖤</span>
    </div>

    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-nunito text-gold tracking-wider">
        Заявка отправлена
      </h2>
      <p className="text-dim text-sm font-nunito max-w-xs">
        Заявка <span className="text-gold">#{bookingId}</span> принята.
        Мастер свяжется с тобой в ближайшее время.
      </p>
    </div>

    <Link
      to="/"
      className="mt-2 px-6 h-11 inline-flex items-center justify-center
                 bg-surface border border-gold/40 rounded-sm
                 text-gold text-xs tracking-widest uppercase font-nunito
                 transition-all duration-300
                 hover:border-gold hover:shadow-[0_0_20px_rgba(187,166,141,0.2)]"
    >
      На главную
    </Link>
  </div>
);