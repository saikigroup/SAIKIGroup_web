'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ContentBlock {
  type: string;
  content: string;
}

interface ArticleBodyProps {
  blocks: string | ContentBlock[];
}

/**
 * Parse HTML string into ContentBlock array so both static and
 * Supabase articles render with the exact same components and animations.
 */
function parseHtmlToBlocks(html: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  // Match top-level tags: <h2>, <h3>, <p>, <blockquote>, <ul>, <ol>, <hr>
  const tagRegex = /<(h2|h3|p|blockquote|ul|ol|hr)([\s>][\s\S]*?)<\/\1>|<hr\s*\/?>/gi;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const fullMatch = match[0];
    const tag = (match[1] || '').toLowerCase();

    if (fullMatch.startsWith('<hr')) {
      blocks.push({ type: 'divider', content: '' });
      continue;
    }

    // Strip inner HTML tags to get text content
    const innerHtml = match[2] || '';
    // Remove the leading > from the capture
    const content = innerHtml
      .replace(/^>/, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&ldquo;/g, '\u201C')
      .replace(/&rdquo;/g, '\u201D')
      .trim();

    if (!content && tag !== 'hr') continue;

    if (tag === 'h2' || tag === 'h3') {
      blocks.push({ type: 'heading', content });
    } else if (tag === 'blockquote') {
      blocks.push({ type: 'pullquote', content });
    } else if (tag === 'ul' || tag === 'ol') {
      // Keep list HTML intact for rendering
      const listHtml = fullMatch;
      blocks.push({ type: 'list', content: listHtml });
    } else {
      blocks.push({ type: 'paragraph', content });
    }
  }

  return blocks;
}

export function ArticleBody({ blocks }: ArticleBodyProps) {
  // Convert HTML string to blocks for unified rendering
  const parsedBlocks = useMemo(() => {
    if (typeof blocks === 'string') {
      return parseHtmlToBlocks(blocks);
    }
    return blocks;
  }, [blocks]);

  let isFirstParagraph = true;

  return (
    <div className="article-body">
      {parsedBlocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <motion.h2
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
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
              viewport={{ once: true, amount: 0.1 }}
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

        if (block.type === 'list') {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="article-list-block text-text-secondary text-base md:text-lg leading-[1.85] mb-6"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          );
        }

        if (block.type === 'divider') {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="editorial-divider-bold w-16 mx-auto my-12"
            />
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
