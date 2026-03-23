'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { ProjectFilter } from '@/components/shared/ProjectFilter';

interface ProjectItem {
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  excerpt: string;
  industry: string;
  year: string;
}

interface ProjectGridProps {
  items: ProjectItem[];
  filterLabels: {
    all: string;
    imagery: string;
    technology: string;
    consultancy: string;
  };
  locale: string;
}

export function ProjectGrid({ items, filterLabels, locale }: ProjectGridProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? items
    : items.filter((item) => item.category === activeFilter);

  const counts = {
    all: items.length,
    imagery: items.filter((i) => i.category === 'imagery').length,
    technology: items.filter((i) => i.category === 'technology').length,
    consultancy: items.filter((i) => i.category === 'consultancy').length,
  };

  return (
    <div>
      <div className="mb-10">
        <ProjectFilter
          active={activeFilter}
          onChange={setActiveFilter}
          labels={filterLabels}
          counts={counts}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((item, idx) => (
            <ProjectCard
              key={item.slug}
              slug={item.slug}
              title={item.title}
              excerpt={item.excerpt}
              category={item.category}
              categoryLabel={item.categoryLabel}
              industry={item.industry}
              year={item.year}
              locale={locale}
              index={idx}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
