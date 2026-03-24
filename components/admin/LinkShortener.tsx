'use client';

import { useState } from 'react';

interface LinkShortenerProps {
  value: string;
  onChange: (value: string) => void;
  password: string;
  label?: string;
  placeholder?: string;
  helpText?: string;
  /** Pre-fill base article URL for UTM builder */
  articleBaseUrl?: string;
}

const UTM_SOURCES = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
];

const UTM_MEDIUMS = [
  { value: 'social', label: 'Social Post' },
  { value: 'infographic', label: 'Infographic' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'story', label: 'Story/Reels' },
  { value: 'bio', label: 'Bio Link' },
  { value: 'email', label: 'Email' },
];

export function LinkShortener({
  value,
  onChange,
  password,
  label = 'Link CTA',
  placeholder = 'https://saiki.id/id/insights/artikel-slug',
  helpText,
}: LinkShortenerProps) {
  const [showUtmBuilder, setShowUtmBuilder] = useState(false);
  const [shortening, setShortening] = useState(false);
  const [shortenError, setShortenError] = useState('');
  const [shortened, setShortened] = useState(false);
  const [customSlug, setCustomSlug] = useState('');

  // UTM state
  const [baseUrl, setBaseUrl] = useState('');
  const [utmSource, setUtmSource] = useState('instagram');
  const [utmMedium, setUtmMedium] = useState('social');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmContent, setUtmContent] = useState('');

  const buildUtmLink = () => {
    if (!baseUrl.trim()) return;
    const url = new URL(baseUrl.trim());
    url.searchParams.set('utm_source', utmSource);
    url.searchParams.set('utm_medium', utmMedium);
    if (utmCampaign.trim()) url.searchParams.set('utm_campaign', utmCampaign.trim());
    if (utmContent.trim()) url.searchParams.set('utm_content', utmContent.trim());
    onChange(url.toString());
    setShowUtmBuilder(false);
  };

  const handleShorten = async () => {
    if (!value.trim()) return;
    setShortening(true);
    setShortenError('');
    setShortened(false);

    try {
      const res = await fetch('/api/admin/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          url: value.trim(),
          key: customSlug.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onChange(data.shortLink);
        setShortened(true);
        setCustomSlug('');
        setTimeout(() => setShortened(false), 3000);
      } else {
        setShortenError(data.error || 'Failed to shorten');
      }
    } catch {
      setShortenError('Network error');
    }
    setShortening(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>

      {/* URL input + shorten button */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => { onChange(e.target.value); setShortened(false); }}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none transition"
        />
        <button
          onClick={handleShorten}
          disabled={!value.trim() || shortening}
          className={`px-4 py-3 text-sm font-medium rounded-xl transition whitespace-nowrap shrink-0 ${
            shortened
              ? 'bg-green-100 text-green-700'
              : 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {shortening ? 'Shortening...' : shortened ? 'Shortened!' : 'Shorten'}
        </button>
      </div>

      {/* Custom slug (optional) */}
      {value.trim() && !shortened && (
        <div className="mt-2">
          <input
            type="text"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            placeholder="Custom slug (opsional, contoh: branding-tips)"
            className="w-full px-3 py-2 text-xs border border-gray-100 rounded-lg focus:border-teal-500 outline-none transition"
          />
        </div>
      )}

      {shortenError && (
        <p className="text-xs text-red-500 mt-1.5">{shortenError}</p>
      )}

      {/* Help text + UTM builder toggle */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">
          {helpText || 'Link akan dipersingkat via Dub.co. UTM tracking tetap berjalan.'}
        </p>
        <button
          onClick={() => setShowUtmBuilder(!showUtmBuilder)}
          className="text-xs text-teal-600 hover:text-teal-800 font-medium shrink-0 ml-2"
        >
          {showUtmBuilder ? 'Tutup' : 'UTM Builder'}
        </button>
      </div>

      {/* UTM Builder panel */}
      {showUtmBuilder && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Base URL *</label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://saiki.id/id/insights/artikel-slug"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Source *</label>
              <select value={utmSource} onChange={(e) => setUtmSource(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none">
                {UTM_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Medium *</label>
              <select value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none">
                {UTM_MEDIUMS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Campaign</label>
              <input
                type="text"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="contoh: personal-branding-mar25"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
              <input
                type="text"
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="contoh: infographic-slide"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Preview */}
          {baseUrl.trim() && (
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-400 mb-1">Preview:</p>
              <p className="text-xs text-gray-700 break-all font-mono">
                {(() => {
                  try {
                    const url = new URL(baseUrl.trim());
                    url.searchParams.set('utm_source', utmSource);
                    url.searchParams.set('utm_medium', utmMedium);
                    if (utmCampaign.trim()) url.searchParams.set('utm_campaign', utmCampaign.trim());
                    if (utmContent.trim()) url.searchParams.set('utm_content', utmContent.trim());
                    return url.toString();
                  } catch {
                    return 'URL tidak valid';
                  }
                })()}
              </p>
            </div>
          )}

          <button
            onClick={buildUtmLink}
            disabled={!baseUrl.trim()}
            className="w-full py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition disabled:opacity-40"
          >
            Generate UTM Link
          </button>
        </div>
      )}
    </div>
  );
}
