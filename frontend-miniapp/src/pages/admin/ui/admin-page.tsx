import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui';

export const AdminPage = () => (
  <div className="p-4">
    <Link to="/" className="text-xs text-txt-secondary uppercase tracking-widest">
      ← Назад
    </Link>
    <h1 className="serif text-2xl mt-3 mb-4">Панель мастера</h1>

    <p className="text-sm text-txt-secondary mb-4">
      Управление портфолио, эскизами и рассылками происходит через Telegram-бота:
    </p>

    <ol className="text-sm text-txt-primary space-y-2 list-decimal list-inside mb-6">
      <li>Откройте бота в Telegram</li>
      <li>
        Отправьте команду <code className="text-accent-blood">/admin</code>
      </li>
      <li>Выберите действие: добавить работу, эскиз или создать рассылку</li>
    </ol>

    <Button asChild variant="outline" className="w-full">
      <a href="https://t.me/" target="_blank" rel="noreferrer">
        Открыть бота
      </a>
    </Button>
  </div>
);