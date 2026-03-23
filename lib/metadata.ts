import type { Metadata } from 'next';
import type { Locale } from './i18n';
import { routeMap } from './i18n';
import { getPageSeo } from '@/content/seo';
import { getSeoConfig, type SeoConfig } from './seo-config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id';

function getPageUrl(page: string, locale: Locale, siteUrl?: string): string {
  const base = siteUrl || BASE_URL;
  const path = routeMap[page]?.[locale] ?? '';
  return `${base}/${locale}${path ? `/${path}` : ''}`;
}

export async function generatePageMetadata(page: string, locale: Locale): Promise<Metadata> {
  const config = await getSeoConfig();
  const siteUrl = config.global.siteUrl || BASE_URL;

  // DB page SEO takes priority, static as fallback
  const dbPageSeo = config.pages[page]?.[locale];
  const staticSeo = getPageSeo(page, locale);
  const seo = {
    ...staticSeo,
    ...Object.fromEntries(
      Object.entries(dbPageSeo || {}).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0))
    ),
  };

  const pageUrl = getPageUrl(page, locale, siteUrl);
  const ogImage = `${siteUrl}${config.global.ogImage || '/og-image.png'}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      url: pageUrl,
      siteName: config.global.siteName || 'SAIKI Group',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo.ogTitle || seo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: [ogImage],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'id': getPageUrl(page, 'id', siteUrl),
        'en': getPageUrl(page, 'en', siteUrl),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// JSON-LD structured data generators (async, reads from DB config)

export async function organizationSchema(): Promise<Record<string, unknown>> {
  const config = await getSeoConfig();
  const siteUrl = config.global.siteUrl || BASE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.organization.name,
    url: siteUrl,
    logo: `${siteUrl}${config.organization.logo}`,
    description: config.global.defaultDescription,
    sameAs: config.organization.socialLinks || [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: config.organization.email,
      telephone: config.organization.phone,
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
  };
}

export async function websiteSchema(): Promise<Record<string, unknown>> {
  const config = await getSeoConfig();
  const siteUrl = config.global.siteUrl || BASE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.global.siteName,
    url: siteUrl,
    inLanguage: ['id', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export async function serviceSchema(name: string, description: string): Promise<Record<string, unknown>> {
  const config = await getSeoConfig();
  const siteUrl = config.global.siteUrl || BASE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: config.organization.name,
      url: siteUrl,
    },
  };
}

export async function articleSchema(title: string, description: string, date: string, slug: string): Promise<Record<string, unknown>> {
  const config = await getSeoConfig();
  const siteUrl = config.global.siteUrl || BASE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: date,
    url: `${siteUrl}/insights/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: config.organization.name,
      url: siteUrl,
    },
  };
}

// Re-export for backward compatibility
export { getSeoConfig, type SeoConfig };
