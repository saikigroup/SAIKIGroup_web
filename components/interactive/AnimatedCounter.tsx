'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, className = '', duration = 2 }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const numericValue = parseFloat(value);
  const isNumeric = !isNaN(numericValue) && isFinite(numericValue);
  const hasDecimal = isNumeric && value.includes('.');

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    if (!isNumeric) return value;
    if (hasDecimal) {
      const decimals = value.split('.')[1]?.length ?? 1;
      return current.toFixed(decimals);
    }
    return Math.round(current).toString();
  });

  useEffect(() => {
    if (isInView && isNumeric) {
      spring.set(numericValue);
    }
  }, [isInView, isNumeric, numericValue, spring]);

  if (!isNumeric) {
    return (
      <motion.span
        ref={ref}
        className={className}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {value}
      </motion.span>
    );
  }

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
