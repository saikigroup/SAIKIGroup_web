'use client';

import { useState, useEffect, useCallback } from 'react';

// ----- Types -----

interface SeoPageData {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
}

interface SeoConfig {
  global: {
    siteName: string;
    siteUrl: string;
    defaultDescription: string;
    ogImage: string;
    favicon: string;
  };
  verification: {
    google: string;
    bing: string;
  };
  organization: {
    name: string;
    email: string;
    phone: string;
    logo: string;
    socialLinks: string[];
  };
  pages: Record<string, Record<string, SeoPageData>>;
  robots: {
    disallow: string[];
  };
}

// Page display labels
const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  about: 'About / Tentang',
  services: 'Services / Layanan',
  consultancy: 'Consultancy',
  imagery: 'Imagery',
  technology: 'Technology',
  insights: 'Insights',
  contact: 'Contact / Kontak',
};

const TABS = [
  { key: 'global', label: 'Global' },
  { key: 'pages', label: 'Page SEO' },
  { key: 'organization', label: 'Organization' },
  { key: 'verification', label: 'Verification' },
  { key: 'robots', label: 'Robots' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function AdminSeoPage() {
  // Auth
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Data
  const [config, setConfig] = useState<SeoConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  // UI
  const [activeTab, setActiveTab] = useState<TabKey>('global');
  const [activePage, setActivePage] = useState('home');
  const [activeLocale, setActiveLocale] = useState<'id' | 'en'>('id');

  // Auth check
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('admin_pw', password);
        setAuthenticated(true);
      } else {
        setAuthError('Invalid password');
      }
    } catch {
      setAuthError('Connection error');
    }
  };

  // Fetch config
  const fetchConfig = useCallback(async () => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo', {
        headers: { 'x-admin-password': pw },
      });
      if (res.status === 401) {
        sessionStorage.removeItem('admin_pw');
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setConfig(data.data);
        if (data.updatedAt) {
          setLastUpdated(new Date(data.updatedAt).toLocaleString('id-ID'));
        }
      }
    } catch {
      setSaveError('Failed to load SEO config');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchConfig();
  }, [authenticated, fetchConfig]);

  // Save
  const handleSave = async () => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw || !config) return;
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: {
          'x-admin-password': pw,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
      });
      if (res.status === 401) {
        sessionStorage.removeItem('admin_pw');
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('SEO config saved successfully!');
        setLastUpdated(new Date().toLocaleString('id-ID'));
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        setSaveError(data.error || 'Failed to save');
      }
    } catch {
      setSaveError('Failed to save SEO config');
    } finally {
      setSaving(false);
    }
  };

  // Helpers
  const updateGlobal = (field: string, value: string) => {
    if (!config) return;
    setConfig({ ...config, global: { ...config.global, [field]: value } });
  };

  const updateVerification = (field: string, value: string) => {
    if (!config) return;
    setConfig({ ...config, verification: { ...config.verification, [field]: value } });
  };

  const updateOrganization = (field: string, value: string | string[]) => {
    if (!config) return;
    setConfig({ ...config, organization: { ...config.organization, [field]: value } });
  };

  const updatePageSeo = (page: string, locale: string, field: string, value: string | string[]) => {
    if (!config) return;
    const pages = { ...config.pages };
    if (!pages[page]) pages[page] = {};
    if (!pages[page][locale]) pages[page][locale] = { title: '', description: '' };
    pages[page][locale] = { ...pages[page][locale], [field]: value };
    setConfig({ ...config, pages });
  };

  const updateRobotsDisallow = (value: string[]) => {
    if (!config) return;
    setConfig({ ...config, robots: { ...config.robots, disallow: value } });
  };

  // ----- Login Screen -----
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">SAIKI Admin</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-teal-500 outline-none mb-3"
          />
          {authError && <p className="text-red-500 text-sm mb-3">{authError}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition text-sm"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading SEO config...</div>
      </div>
    );
  }

  // ----- Page data for current selection -----
  const currentPageData: SeoPageData = config.pages[activePage]?.[activeLocale] ?? { title: '', description: '' };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">SAIKI Admin</h1>
            </div>
            <nav className="flex items-center gap-1">
              <a href="/admin" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">
                Inquiries
              </a>
              <a href="/admin/articles" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">
                Articles
              </a>
              <span className="px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg">
                SEO
              </span>
              <a href="/admin/prompt-library" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">
                Prompt Library
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-400 hidden sm:inline">
                Last saved: {lastUpdated}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : 'Save All'}
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('admin_pw');
                setAuthenticated(false);
              }}
              className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Toast Messages */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm shadow-lg">
          {saveSuccess}
        </div>
      )}
      {saveError && (
        <div className="fixed top-20 right-6 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm shadow-lg">
          {saveError}
          <button onClick={() => setSaveError('')} className="ml-3 text-red-500 hover:text-red-700">&times;</button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">SEO Configuration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all SEO metadata, structured data, and search engine settings from one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-white rounded-xl border border-gray-200 p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeTab === tab.key
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          {/* ===== GLOBAL TAB ===== */}
          {activeTab === 'global' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Global Settings</h3>
                <p className="text-sm text-gray-500">Site-wide SEO defaults applied across all pages.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Site Name" hint="Displayed in title template: Page Title | Site Name">
                  <input
                    type="text"
                    value={config.global.siteName}
                    onChange={(e) => updateGlobal('siteName', e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Site URL" hint="Base URL for canonical links and sitemap">
                  <input
                    type="url"
                    value={config.global.siteUrl}
                    onChange={(e) => updateGlobal('siteUrl', e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Default Description" hint="Fallback meta description" className="md:col-span-2">
                  <textarea
                    value={config.global.defaultDescription}
                    onChange={(e) => updateGlobal('defaultDescription', e.target.value)}
                    rows={2}
                    className="input"
                  />
                </Field>
                <Field label="OG Image Path" hint="Default social sharing image (1200x630px recommended)">
                  <input
                    type="text"
                    value={config.global.ogImage}
                    onChange={(e) => updateGlobal('ogImage', e.target.value)}
                    className="input"
                    placeholder="/og-image.png"
                  />
                </Field>
                <Field label="Favicon Path" hint="Path to favicon file in /public">
                  <input
                    type="text"
                    value={config.global.favicon}
                    onChange={(e) => updateGlobal('favicon', e.target.value)}
                    className="input"
                    placeholder="/favicon.svg"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* ===== PAGES TAB ===== */}
          {activeTab === 'pages' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Per-Page SEO</h3>
                <p className="text-sm text-gray-500">Configure title, description, and keywords for each page and locale.</p>
              </div>

              {/* Page & Locale selectors */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={activePage}
                  onChange={(e) => setActivePage(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none"
                >
                  {Object.entries(PAGE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setActiveLocale('id')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                      activeLocale === 'id' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    onClick={() => setActiveLocale('en')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                      activeLocale === 'en' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-5">
                <Field label="Page Title" hint={`${(currentPageData.title || '').length}/60 characters recommended`}>
                  <input
                    type="text"
                    value={currentPageData.title || ''}
                    onChange={(e) => updatePageSeo(activePage, activeLocale, 'title', e.target.value)}
                    className="input"
                  />
                  <CharCount value={currentPageData.title || ''} max={60} />
                </Field>
                <Field label="Meta Description" hint={`${(currentPageData.description || '').length}/160 characters recommended`}>
                  <textarea
                    value={currentPageData.description || ''}
                    onChange={(e) => updatePageSeo(activePage, activeLocale, 'description', e.target.value)}
                    rows={3}
                    className="input"
                  />
                  <CharCount value={currentPageData.description || ''} max={160} />
                </Field>
                <Field label="OG Title" hint="Override for social media (leave empty to use page title)">
                  <input
                    type="text"
                    value={currentPageData.ogTitle || ''}
                    onChange={(e) => updatePageSeo(activePage, activeLocale, 'ogTitle', e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="OG Description" hint="Override for social media (leave empty to use meta description)">
                  <textarea
                    value={currentPageData.ogDescription || ''}
                    onChange={(e) => updatePageSeo(activePage, activeLocale, 'ogDescription', e.target.value)}
                    rows={2}
                    className="input"
                  />
                </Field>
                <Field label="Keywords" hint="Comma-separated keywords">
                  <input
                    type="text"
                    value={(currentPageData.keywords || []).join(', ')}
                    onChange={(e) => {
                      const keywords = e.target.value.split(',').map((k) => k.trim()).filter(Boolean);
                      updatePageSeo(activePage, activeLocale, 'keywords', keywords);
                    }}
                    className="input"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </Field>

                {/* Search Preview */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Google Search Preview</h4>
                  <div className="bg-gray-50 rounded-xl p-4 max-w-xl">
                    <div className="text-blue-700 text-lg leading-snug truncate">
                      {currentPageData.title || 'Page Title'}
                    </div>
                    <div className="text-green-700 text-sm mt-0.5 truncate">
                      {config.global.siteUrl}/{activeLocale}/...
                    </div>
                    <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {currentPageData.description || 'Meta description will appear here...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== ORGANIZATION TAB ===== */}
          {activeTab === 'organization' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Organization Schema</h3>
                <p className="text-sm text-gray-500">Structured data for Google Knowledge Panel and rich results.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Organization Name">
                  <input
                    type="text"
                    value={config.organization.name}
                    onChange={(e) => updateOrganization('name', e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={config.organization.email}
                    onChange={(e) => updateOrganization('email', e.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    value={config.organization.phone}
                    onChange={(e) => updateOrganization('phone', e.target.value)}
                    className="input"
                    placeholder="+6287788980088"
                  />
                </Field>
                <Field label="Logo Path" hint="Path to logo in /public">
                  <input
                    type="text"
                    value={config.organization.logo}
                    onChange={(e) => updateOrganization('logo', e.target.value)}
                    className="input"
                    placeholder="/images/logo.svg"
                  />
                </Field>
                <Field label="Social Media Links" hint="One URL per line" className="md:col-span-2">
                  <textarea
                    value={(config.organization.socialLinks || []).join('\n')}
                    onChange={(e) => {
                      const links = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean);
                      updateOrganization('socialLinks', links);
                    }}
                    rows={4}
                    className="input"
                    placeholder="https://instagram.com/saikigroup&#10;https://linkedin.com/company/saikigroup"
                  />
                </Field>
              </div>

              {/* Schema Preview */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">JSON-LD Preview</h4>
                <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto max-h-64">
                  {JSON.stringify(
                    {
                      '@context': 'https://schema.org',
                      '@type': 'Organization',
                      name: config.organization.name,
                      url: config.global.siteUrl,
                      logo: `${config.global.siteUrl}${config.organization.logo}`,
                      email: config.organization.email,
                      telephone: config.organization.phone,
                      sameAs: config.organization.socialLinks,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}

          {/* ===== VERIFICATION TAB ===== */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Search Engine Verification</h3>
                <p className="text-sm text-gray-500">Verification codes for Google Search Console, Bing Webmaster Tools, etc.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Google Search Console"
                  hint="Content value from the meta tag verification code"
                >
                  <input
                    type="text"
                    value={config.verification.google}
                    onChange={(e) => updateVerification('google', e.target.value)}
                    className="input"
                    placeholder="e.g. abc123xyz..."
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Get it from{' '}
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline"
                    >
                      Google Search Console
                    </a>
                    {' '}&rarr; Settings &rarr; Ownership verification &rarr; HTML tag
                  </p>
                </Field>
                <Field
                  label="Bing Webmaster Tools"
                  hint="Content value from Bing verification meta tag"
                >
                  <input
                    type="text"
                    value={config.verification.bing}
                    onChange={(e) => updateVerification('bing', e.target.value)}
                    className="input"
                    placeholder="e.g. ABCDEF1234..."
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Get it from{' '}
                    <a
                      href="https://www.bing.com/webmasters"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline"
                    >
                      Bing Webmaster Tools
                    </a>
                    {' '}&rarr; Add site &rarr; HTML meta tag
                  </p>
                </Field>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Generated Meta Tags</h4>
                <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto">
{config.verification.google
  ? `<meta name="google-site-verification" content="${config.verification.google}" />`
  : '<!-- Google verification not set -->'
}
{'\n'}
{config.verification.bing
  ? `<meta name="msvalidate.01" content="${config.verification.bing}" />`
  : '<!-- Bing verification not set -->'
}
                </pre>
              </div>
            </div>
          )}

          {/* ===== ROBOTS TAB ===== */}
          {activeTab === 'robots' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Robots Configuration</h3>
                <p className="text-sm text-gray-500">Control which paths search engine crawlers can access.</p>
              </div>

              <Field label="Disallowed Paths" hint="One path per line. These paths will be blocked from crawling.">
                <textarea
                  value={config.robots.disallow.join('\n')}
                  onChange={(e) => {
                    const paths = e.target.value.split('\n').map((p) => p.trim()).filter(Boolean);
                    updateRobotsDisallow(paths);
                  }}
                  rows={6}
                  className="input font-mono text-sm"
                  placeholder="/api/&#10;/_next/&#10;/admin/"
                />
              </Field>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">robots.txt Preview</h4>
                <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto">
{`User-agent: *
Allow: /
${config.robots.disallow.map((p) => `Disallow: ${p}`).join('\n')}

Sitemap: ${config.global.siteUrl}/sitemap.xml`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline styles for inputs */}
      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.625rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: #14b8a6;
        }
        textarea.input {
          resize: vertical;
        }
      `}</style>
    </div>
  );
}

// ----- Sub-components -----

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const color = len === 0 ? 'text-gray-400' : len <= max ? 'text-green-600' : 'text-amber-600';
  return (
    <div className={`text-xs mt-1.5 ${color}`}>
      {len}/{max} characters
    </div>
  );
}
