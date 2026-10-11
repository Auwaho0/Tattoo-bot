import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { useTheme } from '@/features/home';
import './styles/index.css';

// Применяем класс .dark ДО маунта React.
// useTheme.getState() даёт синхронный доступ к persist-стору (zustand
// для localStorage гидратируется сразу при импорте модуля).
const applyTheme = (isDark: boolean) => {
  document.documentElement.classList.toggle('dark', isDark);
};

applyTheme(useTheme.getState().isDark);

// Подписка на изменения — реагирует на toggle и на applyTelegram
useTheme.subscribe((state) => applyTheme(state.isDark));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);