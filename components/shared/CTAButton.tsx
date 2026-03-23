'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  href: string;
  children: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const variants = {
  primary:
    'bg-gradient-to-r from-brand-teal to-teal-500 text-white border-transparent hover:shadow-lg hover:shadow-teal-500/25',
  secondary:
    'bg-white/80 backdrop-blur-sm text-brand-teal border-brand-teal/20 hover:bg-brand-teal hover:text-white hover:border-brand-teal',
  ghost:
    'bg-transparent text-brand-teal border-transparent hover:bg-brand-teal/5',
};

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-base',
  lg: 'px-9 py-4 text-lg',
};

export function CTAButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon = true,
  className = '',
  style,
  onClick,
}: CTAButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <Link
        href={href}
        onClick={onClick}
        className={`
          inline-flex items-center gap-2.5 font-semibold tracking-tight
          border rounded-xl transition-all duration-300
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        style={style}
      >
        {children}
        {icon && (
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </Link>
    </motion.div>
  );
}
