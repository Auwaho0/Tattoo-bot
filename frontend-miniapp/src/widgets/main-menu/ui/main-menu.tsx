import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { haptic } from '@/shared/lib';

interface MenuItem {
  to: string;
  label: string;
  icon: string;
}

const items: MenuItem[] = [
  { to: '/portfolio', label: 'Портфолио', icon: '📸' },
  { to: '/sketches', label: 'Эскизы', icon: '🖤' },
  { to: '/admin', label: 'Мастер', icon: '👑' },
];

export const MainMenu = () => (
  <div className="grid grid-cols-2 gap-3 mt-10 max-w-md mx-auto">
    {items.map((item, i) => (
      <motion.div
        key={item.to}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * i, duration: 0.5 }}
      >
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full h-24 flex-col gap-1"
          onClick={() => haptic('light')}
        >
          <Link to={item.to}>
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs uppercase tracking-widest">{item.label}</span>
          </Link>
        </Button>
      </motion.div>
    ))}
  </div>
);