import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SAIKI Group',
    template: '%s | SAIKI Group',
  },
  description: 'SAIKI Group — Consultancy, Branding & Technology',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
