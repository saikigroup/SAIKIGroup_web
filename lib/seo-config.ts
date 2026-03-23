import { getSupabaseAdmin, TABLES } from './supabase';
import { seoData } from '@/content/seo';
import type { Locale } from './i18n';

// ----- Types -----

export interface SeoPageData {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
}

export interface SeoGlobal {
  siteName: string;
  siteUrl: string;
  defaultDescription: string;
  ogImage: string;
  favicon: string;
}

export interface SeoVerification {
  google: string;
  bing: string;
}

export interface SeoOrganization {
  name: string;
  email: string;
  phone: string;
  logo: string;
  socialLinks: string[];
}

export interface SeoRobots {
  disallow: string[];
}

export interface SeoConfig {
  global: SeoGlobal;
  verification: SeoVerification;
  organization: SeoOrganization;
  pages: Record<string, Record<string, SeoPageData>>;
  robots: SeoRobots;
}

// ----- Defaults (matches current static config) -----

export const defaultSeoConfig: SeoConfig = {
  global: {
    siteName: 'SAIKI Group',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id',
    defaultDescription: 'SAIKI Group | Consultancy, Branding & Technology',
    ogImage: '/og-image.png',
    favicon: '/favicon.svg',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
  },
  organization: {
    name: 'SAIKI Group',
    email: 'info@saiki.id',
    phone: '+6287788980088',
    logo: '/images/logo.svg',
    socialLinks: [],
  },
  pages: Object.fromEntries(
    Object.entries(seoData).map(([page, locales]) => [
      page,
      Object.fromEntries(
        Object.entries(locales).map(([locale, data]) => [locale, data])
      ),
    ])
  ),
  robots: {
    disallow: ['/api/', '/_next/', '/admin/'],
  },
};

// ----- Cache -----

let cachedConfig: SeoConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

/**
 * Fetch SEO config from Supabase with in-memory cache.
 * Falls back to defaults if Supabase is unavailable.
 */
export async function getSeoConfig(): Promise<SeoConfig> {
  const now = Date.now();
  if (cachedConfig && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedConfig;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    cachedConfig = defaultSeoConfig;
    cacheTimestamp = now;
    return defaultSeoConfig;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.SEO_CONFIG)
      .select('config')
      .eq('id', 1)
      .single();

    if (error || !data?.config) {
      cachedConfig = defaultSeoConfig;
      cacheTimestamp = now;
      return defaultSeoConfig;
    }

    // Deep merge DB config over defaults so missing fields use defaults
    // Filter out empty strings from DB verification so env-var defaults are preserved
    const dbConfig = data.config as Partial<SeoConfig>;
    const dbVerification = dbConfig.verification ?? {};
    const filteredVerification = Object.fromEntries(
      Object.entries(dbVerification).filter(([, v]) => v !== '' && v != null)
    );
    const merged: SeoConfig = {
      global: { ...defaultSeoConfig.global, ...dbConfig.global },
      verification: { ...defaultSeoConfig.verification, ...filteredVerification },
      organization: { ...defaultSeoConfig.organization, ...dbConfig.organization },
      pages: { ...defaultSeoConfig.pages, ...dbConfig.pages },
      robots: { ...defaultSeoConfig.robots, ...dbConfig.robots },
    };

    cachedConfig = merged;
    cacheTimestamp = now;
    return merged;
  } catch {
    cachedConfig = defaultSeoConfig;
    cacheTimestamp = now;
    return defaultSeoConfig;
  }
}

/**
 * Get SEO data for a specific page & locale from the config.
 */
export async function getPageSeoFromConfig(
  page: string,
  locale: Locale
): Promise<SeoPageData> {
  const config = await getSeoConfig();
  return (
    config.pages[page]?.[locale] ??
    config.pages.home?.[locale] ??
    defaultSeoConfig.pages.home[locale]
  );
}

/**
 * Invalidate the cache (call after admin saves).
 */
export function invalidateSeoCache(): void {
  cachedConfig = null;
  cacheTimestamp = 0;
}
