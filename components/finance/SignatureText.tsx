'use client';

interface SignatureTextProps {
  name: string;
  className?: string;
}

export default function SignatureText({ name, className = '' }: SignatureTextProps) {
  if (!name) return null;

  return (
    <span
      className={`signature-font ${className}`}
      style={{
        fontFamily: "'Bastliga One', cursive",
        fontSize: '28px',
        lineHeight: 1.2,
        color: '#1a1a2e',
      }}
    >
      {name}
    </span>
  );
}
