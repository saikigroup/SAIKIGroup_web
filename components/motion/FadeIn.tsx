'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { fadeIn, fadeInUp, durations, easings } from '@/lib/motion';

interface FadeInProps {
  children: ReactNode;
  direction?: 'up' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = durations.normal,
  className,
  once = true,
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  const variants = direction === 'up' ? fadeInUp : fadeIn;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            duration,
            ease: easings.editorial,
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
