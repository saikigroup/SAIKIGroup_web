'use client';

import { motion } from 'framer-motion';

interface ProjectFilterProps {
  active: string;
  onChange: (filter: string) => void;
  labels: {
    all: string;
    imagery: string;
    technology: string;
    consultancy: string;
  };
  counts: {
    all: number;
    imagery: number;
    technology: number;
    consultancy: number;
  };
}

const filters = ['all', 'imagery', 'technology', 'consultancy'] as const;

const dotColors: Record<string, string> = {
  all: 'bg-brand-teal',
  imagery: 'bg-cyan-500',
  technology: 'bg-violet-500',
  consultancy: 'bg-rose-500',
};

export function ProjectFilter({ active, onChange, labels, counts }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = active === filter;
        return (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'text-white'
                : 'text-text-secondary hover:text-brand-black hover:bg-black/5'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="project-filter-active"
                className="absolute inset-0 bg-brand-black rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dotColors[filter]}`} />
              {labels[filter as keyof typeof labels]}
              <span className={`text-xs ${isActive ? 'text-white/60' : 'text-text-muted'}`}>
                {counts[filter as keyof typeof counts]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
