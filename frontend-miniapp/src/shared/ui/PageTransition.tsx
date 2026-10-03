import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'forward' | 'back';

const variants = {
  forward: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  back: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
} as const;

interface PageTransitionProps {
  children: ReactNode;
  direction?: Direction;
}

export const PageTransition = ({
  children,
  direction = 'forward',
}: PageTransitionProps) => (
  <motion.div
    variants={variants[direction]}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.25, ease: [0.16, 1, 0.1, 1] }}
    className="w-full"
  >
    {children}
  </motion.div>
);