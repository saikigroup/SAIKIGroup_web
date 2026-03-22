import { serviceAccentColors, type ServiceKey } from '@/lib/utils';

interface ServiceTagProps {
  service: ServiceKey;
  label: string;
  className?: string;
}

export function ServiceTag({ service, label, className = '' }: ServiceTagProps) {
  const bgMap: Record<ServiceKey, string> = {
    consultancy: 'bg-rose-50 text-rose-600 border-rose-200',
    imagery: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    technology: 'bg-violet-50 text-violet-600 border-violet-200',
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full border ${bgMap[service]} ${className}`}
    >
      {label}
    </span>
  );
}
