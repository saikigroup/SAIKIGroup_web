import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SAIKI Group',
    template: '%s | SAIKI Group',
  },
  description: 'SAIKI Group | Consultancy, Branding & Technology',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id'),
  // Search engine verification - set these env vars after registering
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
