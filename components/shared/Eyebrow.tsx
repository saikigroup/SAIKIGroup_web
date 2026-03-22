interface EyebrowProps {
  children: string;
  color?: string;
  className?: string;
}

export function Eyebrow({ children, color, className = '' }: EyebrowProps) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2 ${color || 'text-brand-teal'} ${className}`}
    >
      <span className="inline-block w-6 h-0.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
