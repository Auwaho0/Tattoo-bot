import { motion } from 'framer-motion';
import type { Sketch } from '@/entities/sketch';

interface SketchCardProps {
  sketch: Sketch;
  index: number;
}

export const SketchCard = ({ sketch, index }: SketchCardProps) => (
  <motion.article
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.08 }}
    className="border border-border-gothic rounded-md p-4 bg-bg-secondary"
  >
    <div className="flex justify-between items-start">
      <h3 className="serif text-lg">{sketch.title}</h3>
      <span className="text-xs px-2 py-1 rounded bg-accent-blood text-txt-primary">
        -30%
      </span>
    </div>
    <p className="text-xs text-txt-secondary mt-2">
      {sketch.placement} · {sketch.size}
    </p>
    <div className="flex gap-2 mt-3 items-baseline">
      <span className="line-through text-txt-secondary text-sm">
        {sketch.old_price} ₽
      </span>
      <span className="text-accent-blood text-xl font-bold">
        {sketch.new_price} ₽
      </span>
    </div>
  </motion.article>
);