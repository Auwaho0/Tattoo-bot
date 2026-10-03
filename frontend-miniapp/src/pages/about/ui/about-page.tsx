import { Link } from 'react-router-dom';

export const AboutPage = () => {

  return (
    <div className="p-4 bg-black h-full">
      <Link to="/" className="text-xs text-txt-secondary uppercase tracking-widest">
        ← Назад
      </Link>

      <h1 className="serif text-2xl mt-3 mb-4">Обо мне</h1>


    </div>
  );
};