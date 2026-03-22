'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  y?: number;
}

export function HoverLift({
  children,
  className,
  scale = 1.02,
  y = -4,
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{
        y,
        scale,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
