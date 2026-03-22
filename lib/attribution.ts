// Attribution capture utility
// Captures UTM parameters, click IDs, referrer, and landing page

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landing_page?: string;
  current_page?: string;
}

const ATTRIBUTION_KEY = 'saiki_attribution';
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const CLICK_IDS = ['gclid', 'fbclid'] as const;

export function captureAttribution(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const existing = getAttribution();

  const data: AttributionData = {
    ...existing,
    current_page: window.location.pathname,
  };

  // Only set landing page on first visit
  if (!existing.landing_page) {
    data.landing_page = window.location.href;
  }

  // Capture referrer on first visit
  if (!existing.referrer && document.referrer) {
    data.referrer = document.referrer;
  }

  // Capture UTM params (override if present in current URL)
  for (const param of UTM_PARAMS) {
    const value = params.get(param);
    if (value) data[param] = value;
  }

  // Capture click IDs
  for (const param of CLICK_IDS) {
    const value = params.get(param);
    if (value) data[param] = value;
  }

  try {
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage may be unavailable
  }
}

export function getAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function getAttributionForForm(): Record<string, string> {
  const data = getAttribution();
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value) result[key] = String(value);
  }

  return result;
}
