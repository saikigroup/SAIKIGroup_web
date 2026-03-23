import { Eyebrow } from './Eyebrow';

interface SectionHeadingProps {
  eyebrow?: string;
  headline: string;
  body?: string;
  eyebrowColor?: string;
  headlineStyle?: 'display' | 'sans';
  align?: 'left' | 'center';
  size?: 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses = {
  lg: 'text-2xl sm:text-3xl md:text-4xl',
  xl: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  '2xl': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
};

export function SectionHeading({
  eyebrow,
  headline,
  body,
  eyebrowColor,
  headlineStyle = 'display',
  align = 'left',
  size = 'xl',
  className = '',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const headlineClass =
    headlineStyle === 'display' ? 'heading-display' : 'heading-sans';

  return (
    <div className={`${alignClass} ${className}`}>
      {eyebrow && (
        <div className="mb-4">
          <Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2
        className={`${headlineClass} ${sizeClasses[size]} text-brand-black whitespace-pre-line`}
      >
        {headline}
      </h2>
      {body && (
        <p className={`mt-5 text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {body}
        </p>
      )}
    </div>
  );
}
