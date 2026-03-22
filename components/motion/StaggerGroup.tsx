'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { staggerContainer, fadeInUp } from '@/lib/motion';

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  staggerDelay?: number;
}

export function StaggerGroup({
  children,
  className,
  once = true,
  staggerDelay = 0.1,
}: StaggerGroupProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}
