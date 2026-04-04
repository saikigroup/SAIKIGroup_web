'use client';

import { useRef, useEffect, useState } from 'react';

interface AutoFitSignatureProps {
  name: string;
  maxWidth?: number;
  color?: string;
}

/**
 * Signature text that auto-scales to fit within maxWidth.
 * Longer names shrink, shorter names stay larger.
 */
export default function AutoFitSignature({ name, maxWidth = 180, color = '#1a1a2e' }: AutoFitSignatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(32);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    // Start with a large font size and shrink down to fit
    let size = 36;
    const minSize = 16;

    textRef.current.style.fontSize = `${size}px`;

    while (textRef.current.scrollWidth > maxWidth && size > minSize) {
      size -= 1;
      textRef.current.style.fontSize = `${size}px`;
    }

    setFontSize(size);
  }, [name, maxWidth]);

  if (!name) return null;

  return (
    <div ref={containerRef} style={{ width: maxWidth, overflow: 'hidden' }}>
      <span
        ref={textRef}
        style={{
          fontFamily: "'Bastliga One', cursive",
          fontSize: `${fontSize}px`,
          lineHeight: 1.2,
          color,
          fontWeight: 700,
          display: 'inline-block',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </span>
    </div>
  );
}
