'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  label: string;
}

export function ShareButton({ label }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-brand-teal rounded-full border border-border-subtle/50 hover:border-brand-teal/30 transition-all duration-200"
    >
      <Share2 className="w-4 h-4" />
      {label}
    </button>
  );
}
