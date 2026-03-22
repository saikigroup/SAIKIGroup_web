'use client';

import { motion } from 'framer-motion';

interface ContentBlock {
  type: string;
  content: string;
}

interface ArticleBodyProps {
  blocks: string | ContentBlock[];
}

export function ArticleBody({ blocks }: ArticleBodyProps) {
  // HTML string from Supabase
  if (typeof blocks === 'string') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="article-html-body"
        dangerouslySetInnerHTML={{ __html: blocks }}
      />
    );
  }

  // Block-based content from static files
  let isFirstParagraph = true;

  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <motion.h2
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="heading-sans text-2xl md:text-3xl text-brand-black mt-16 mb-6 relative pl-6 border-l-[3px] border-brand-teal"
            >
              {block.content}
            </motion.h2>
          );
        }

        if (block.type === 'pullquote') {
          return (
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="my-12 md:my-16 py-8 md:py-10 px-8 md:px-12 relative bg-gradient-to-br from-surface-cream via-white to-surface-violet rounded-2xl"
            >
              <div className="absolute top-4 left-6 text-6xl md:text-7xl font-display font-black text-brand-teal/15 leading-none select-none">
                &ldquo;
              </div>
              <p className="relative text-xl md:text-2xl font-medium text-brand-black leading-relaxed italic z-10">
                {block.content}
              </p>
              <div className="editorial-divider-bold w-12 mt-6" />
            </motion.blockquote>
          );
        }

        // paragraph
        const useDropcap = isFirstParagraph;
        if (isFirstParagraph) isFirstParagraph = false;

        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className={`text-text-secondary text-base md:text-lg leading-[1.85] mb-6 ${
              useDropcap ? 'first-letter:text-5xl md:first-letter:text-6xl first-letter:font-display first-letter:font-black first-letter:text-brand-teal first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none' : ''
            }`}
          >
            {block.content}
          </motion.p>
        );
      })}
    </div>
  );
}
