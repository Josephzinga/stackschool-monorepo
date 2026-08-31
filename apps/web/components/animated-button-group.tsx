import React, { ReactNode, useState } from 'react';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

interface AnimatedButtonGroupProps {
  children: ReactNode;
  className?: string;
  gap?: number;
  direction?: 'horizontal' | 'vertical';
}

export const AnimatedButtonGroup: React.FC<AnimatedButtonGroupProps> = ({
  children,
  className = '',
  gap = 8,
  direction = 'horizontal',
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <motion.div
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} items-center ${className}`}
      style={{ gap: `${gap}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {React.Children.map(children, (child: ReactNode, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveIndex(i)}
            className={cn(activeIndex === 1 ? 'z-10' : 'z-0')}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// Exemple d'utilisation
function ButtonGroupExample() {
  const [resourceMode, setResourceMode] = useState<'CLASS' | 'TEACHER'>(
    'CLASS',
  );

  return <div className="flex flex-col gap-4 p-4"></div>;
}

export default ButtonGroupExample;
