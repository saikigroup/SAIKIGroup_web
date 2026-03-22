'use client';

import { useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorGlowProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
}

export function CursorGlow({
  children,
  className = '',
  color = 'rgba(13, 148, 136, 0.15)',
  size = 400,
}: CursorGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);

  const springX = useSpring(mouseX, { stiffness: 200, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 40 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - size / 2);
    mouseY.set(e.clientY - rect.top - size / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(-size);
    mouseY.set(-size);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute pointer-events-none rounded-full blur-3xl"
        style={{
          x: springX,
          y: springY,
          width: size,
          height: size,
          background: color,
        }}
      />
      {children}
    </div>
  );
}
