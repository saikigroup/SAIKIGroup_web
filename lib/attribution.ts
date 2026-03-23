// Attribution capture utility
// Uses localStorage for first-touch persistence (survives tab close)
// and sessionStorage for current_page tracking

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

const FIRST_TOUCH_KEY = 'saiki_first_touch';
const SESSION_KEY = 'saiki_session';
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const CLICK_IDS = ['gclid', 'fbclid'] as const;
// 30-day expiry for first-touch data
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

interface StoredData {
  data: AttributionData;
  ts: number;
}

function readStorage(key: string, storage: Storage): AttributionData {
  try {
    const raw = storage.getItem(key);
    if (!raw) return {};
    const parsed: StoredData = JSON.parse(raw);
    // Expire first-touch after 30 days
    if (key === FIRST_TOUCH_KEY && Date.now() - parsed.ts > EXPIRY_MS) {
      storage.removeItem(key);
      return {};
    }
    return parsed.data;
  } catch {
    return {};
  }
}

function writeStorage(key: string, storage: Storage, data: AttributionData): void {
  try {
    const payload: StoredData = { data, ts: Date.now() };
    storage.setItem(key, JSON.stringify(payload));
  } catch {
    // storage may be unavailable (incognito, full, etc.)
  }
}

export function captureAttribution(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const hasUtm = UTM_PARAMS.some((p) => params.has(p));
  const hasClickId = CLICK_IDS.some((p) => params.has(p));

  // --- First touch (localStorage, persists across sessions) ---
  const firstTouch = readStorage(FIRST_TOUCH_KEY, localStorage);
  const isNewFirstTouch = !firstTouch.utm_source && !firstTouch.gclid && !firstTouch.fbclid;

  if (isNewFirstTouch && (hasUtm || hasClickId || document.referrer)) {
    const ft: AttributionData = {
      landing_page: window.location.href,
      referrer: document.referrer || undefined,
    };
    for (const p of UTM_PARAMS) { const v = params.get(p); if (v) ft[p] = v; }
    for (const p of CLICK_IDS) { const v = params.get(p); if (v) ft[p] = v; }
    writeStorage(FIRST_TOUCH_KEY, localStorage, ft);
  }

  // --- Session data (sessionStorage, tracks last-touch + current page) ---
  const session = readStorage(SESSION_KEY, sessionStorage);

  const updated: AttributionData = {
    ...session,
    current_page: window.location.pathname,
  };

  if (!session.landing_page) {
    updated.landing_page = window.location.href;
  }
  if (!session.referrer && document.referrer) {
    updated.referrer = document.referrer;
  }

  // Last-touch: override UTMs if present in current URL
  for (const p of UTM_PARAMS) { const v = params.get(p); if (v) updated[p] = v; }
  for (const p of CLICK_IDS) { const v = params.get(p); if (v) updated[p] = v; }

  writeStorage(SESSION_KEY, sessionStorage, updated);
}

export function getAttribution(): AttributionData {
  if (typeof window === 'undefined') return {};
  return readStorage(SESSION_KEY, sessionStorage);
}

export function getAttributionForForm(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const firstTouch = readStorage(FIRST_TOUCH_KEY, localStorage);
  const session = readStorage(SESSION_KEY, sessionStorage);

  // Merge: session (last-touch) takes priority, first-touch fills gaps
  const merged: AttributionData = { ...firstTouch, ...session };

  // Also include first-touch separately so we can distinguish in DB
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(merged)) {
    if (value) result[key] = String(value);
  }

  // Add first-touch source separately if different from last-touch
  if (firstTouch.utm_source && firstTouch.utm_source !== session.utm_source) {
    result.first_touch_source = firstTouch.utm_source;
  }
  if (firstTouch.utm_campaign && firstTouch.utm_campaign !== session.utm_campaign) {
    result.first_touch_campaign = firstTouch.utm_campaign;
  }

  return result;
}
