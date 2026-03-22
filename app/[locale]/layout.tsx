import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/lib/i18n';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AnalyticsProvider } from '@/components/layout/Analytics';
import { organizationSchema, websiteSchema } from '@/lib/metadata';

export function generateStaticParams() {
  return [{ locale: 'id' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema()),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-white text-text-primary">
        <AnalyticsProvider locale={locale} />
        <SiteHeader locale={locale as Locale} />
        <main className="flex-grow pt-16 md:pt-20">{children}</main>
        <SiteFooter locale={locale as Locale} />
      </body>
    </html>
  );
}
