interface EyebrowProps {
  children: string;
  color?: string;
  className?: string;
}

export function Eyebrow({ children, color, className = '' }: EyebrowProps) {
  return (
    <span
      className={`eyebrow inline-block ${color || 'text-brand-teal'} ${className}`}
    >
      {children}
    </span>
  );
}
