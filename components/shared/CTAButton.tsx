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
  onClick?: () => void;
}

const variants = {
  primary:
    'bg-brand-teal text-white hover:bg-brand-black border-brand-teal hover:border-brand-black',
  secondary:
    'bg-transparent text-brand-teal border-brand-teal hover:bg-brand-teal hover:text-white',
  ghost:
    'bg-transparent text-brand-teal border-transparent hover:border-brand-teal',
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
  onClick,
}: CTAButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Link
        href={href}
        onClick={onClick}
        className={`
          inline-flex items-center gap-2.5 font-semibold tracking-tight
          border-2 transition-colors duration-300
          ${variants[variant]} ${sizes[size]} ${className}
        `}
      >
        {children}
        {icon && (
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </Link>
    </motion.div>
  );
}
