'use client';

import { motion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  speed?: number;
  separator?: string;
  className?: string;
  textClassName?: string;
}

export function Marquee({
  items,
  speed = 30,
  separator = '  /  ',
  className = '',
  textClassName = '',
}: MarqueeProps) {
  const text = items.join(separator) + separator;

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex"
        animate={{ x: [0, `-50%`] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        <span className={`inline-block ${textClassName}`}>{text}</span>
        <span className={`inline-block ${textClassName}`}>{text}</span>
      </motion.div>
    </div>
  );
}
