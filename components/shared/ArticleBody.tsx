'use client';

interface ContentBlock {
  type: 'paragraph' | 'heading';
  content: string;
}

interface ArticleBodyProps {
  blocks: ContentBlock[];
}

export function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="prose-saiki">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h2
              key={index}
              className="heading-sans text-2xl md:text-3xl text-brand-black mt-12 mb-6 first:mt-0"
            >
              {block.content}
            </h2>
          );
        }

        return (
          <p
            key={index}
            className="text-text-secondary text-base md:text-lg leading-relaxed mb-6"
          >
            {block.content}
          </p>
        );
      })}
    </div>
  );
}
