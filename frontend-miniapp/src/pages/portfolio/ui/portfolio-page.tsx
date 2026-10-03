import { Link } from 'react-router-dom';
import { useWorksQuery } from '@/entities/work';
import { WorkCard } from '@/widgets/work-grid';

export const PortfolioPage = () => {
  const { data, isLoading, isError } = useWorksQuery();


  const works = Array.isArray(data) ? data : [];


  return (
    <div className="p-4 bg-black h-full">
      <Link to="/" className="text-xs text-txt-secondary uppercase tracking-widest">
        ← Назад
      </Link>
      <h1 className="serif text-2xl mt-3 mb-4">Портфолио</h1>

      {isLoading && <div className="text-txt-secondary">Загрузка…</div>}
      {isError && <div className="text-accent-blood">Ошибка загрузки</div>}

      {!isLoading && !isError && !works.length && (
        <div className="text-txt-secondary">
          Пока нет работ. Добавьте их через бота: /admin → Добавить работу.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {works.map((work, i) => (
          <WorkCard key={work.id} work={work} index={i} />
        ))}
      </div>
    </div>
  );
};