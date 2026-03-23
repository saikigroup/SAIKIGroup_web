import type { Metadata } from 'next';
import { getSeoConfig } from '@/lib/seo-config';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSeoConfig();

  return {
    title: {
      default: config.global.siteName || 'SAIKI Group',
      template: `%s | ${config.global.siteName || 'SAIKI Group'}`,
    },
    description: config.global.defaultDescription || 'SAIKI Group | Consultancy, Branding & Technology',
    metadataBase: new URL(config.global.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id'),
    verification: {
      google: config.verification.google || undefined,
      other: {
        ...(config.verification.bing
          ? { 'msvalidate.01': config.verification.bing }
          : {}),
      },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
