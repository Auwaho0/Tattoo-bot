import { Link } from 'react-router-dom';
import { useSketchesQuery } from '@/entities/sketch';
import { SketchCard } from './sketch-card';

export const SketchesPage = () => {
  const { data, isLoading, isError } = useSketchesQuery();

  const sketches = Array.isArray(data) ? data : [];

  return (
    <div className="p-4 bg-black h-full">
      <Link to="/" className="text-xs text-txt-secondary uppercase tracking-widest">
        ← Назад
      </Link>

      <h1 className="serif text-2xl mt-3 mb-4">Эскизы со скидкой</h1>

      {isLoading && <div className="text-txt-secondary">Загрузка…</div>}
      {isError && <div className="text-accent-blood">Ошибка загрузки</div>}

      {!isLoading && !isError && !sketches.length && (
        <div className="text-txt-secondary">
          Свободных эскизов нет. Добавьте их через бота: /admin → Добавить эскиз.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sketches.map((sketch, i) => (
          <SketchCard key={sketch.id} sketch={sketch} index={i} />
        ))}
      </div>
    </div>
  );
};