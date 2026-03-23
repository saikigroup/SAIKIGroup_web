interface EyebrowProps {
  children: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Eyebrow({ children, color, className = '', style }: EyebrowProps) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2 ${color || 'text-brand-teal'} ${className}`}
      style={style}
    >
      <span className="inline-block w-6 h-0.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
