import { motion } from 'framer-motion';
import type { Work } from '@/entities/work';

interface WorkCardProps {
  work: Work;
  index: number;
}

export const WorkCard = ({ work, index }: WorkCardProps) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="border border-border-gothic rounded-md overflow-hidden bg-bg-secondary"
  >
    <div className="aspect-square bg-bg-primary flex items-center justify-center text-txt-secondary text-[10px] p-2 break-all">
      {work.photo_file_id}
    </div>
    <div className="p-3">
      <h3 className="serif text-sm">{work.title}</h3>
      <p className="text-xs text-txt-secondary">
        {work.price} ₽
      </p>
    </div>
  </motion.article>
);