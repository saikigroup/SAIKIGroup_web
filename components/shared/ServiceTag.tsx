import { serviceAccentColors, type ServiceKey } from '@/lib/utils';

interface ServiceTagProps {
  service: ServiceKey;
  label: string;
  className?: string;
}

export function ServiceTag({ service, label, className = '' }: ServiceTagProps) {
  const colors = serviceAccentColors[service];
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase border ${colors.border} ${colors.text} ${className}`}
    >
      {label}
    </span>
  );
}
