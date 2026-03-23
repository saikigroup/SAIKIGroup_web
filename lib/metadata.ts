import type { Metadata } from 'next';
import type { Locale } from './i18n';
import { routeMap } from './i18n';
import { getPageSeo } from '@/content/seo';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id';

function getPageUrl(page: string, locale: Locale): string {
  const path = routeMap[page]?.[locale] ?? '';
  return `${BASE_URL}/${locale}${path ? `/${path}` : ''}`;
}

export function generatePageMetadata(page: string, locale: Locale): Metadata {
  const seo = getPageSeo(page, locale);
  const pageUrl = getPageUrl(page, locale);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      url: pageUrl,
      siteName: 'SAIKI Group',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
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
      images: [`${BASE_URL}/og-image.png`],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'id': getPageUrl(page, 'id'),
        'en': getPageUrl(page, 'en'),
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

// JSON-LD structured data generators
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SAIKI Group',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.svg`,
    description: 'Integrated ecosystem for career consultancy, branding & marketing, and technology development.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@saiki.id',
      telephone: '+6287788980088',
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English'],
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SAIKI Group',
    url: BASE_URL,
    inLanguage: ['id', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function serviceSchema(name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'SAIKI Group',
      url: BASE_URL,
    },
  };
}

export function articleSchema(title: string, description: string, date: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: date,
    url: `${BASE_URL}/insights/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'SAIKI Group',
      url: BASE_URL,
    },
  };
}
