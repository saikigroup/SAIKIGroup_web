// Analytics utility layer
// Supports GA4 via GTM, Meta Pixel, and custom events
// All IDs are configured via environment variables

type EventParams = Record<string, string | number | boolean | undefined>;

// Track custom events via dataLayer (GTM)
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined') return;

  // Push to GTM dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

// Predefined event helpers
export const analytics = {
  pageView: (path: string, locale: string) =>
    trackEvent('page_view', { page_path: path, language: locale }),

  languageSwitch: (from: string, to: string) =>
    trackEvent('language_switch', { from_language: from, to_language: to }),

  serviceCTAClick: (service: string, location: string) =>
    trackEvent('service_cta_click', { service_name: service, click_location: location }),

  contactCTAClick: (location: string) =>
    trackEvent('contact_cta_click', { click_location: location }),

  formStart: (formType: string) =>
    trackEvent('form_start', { form_type: formType }),

  formSubmit: (formType: string, category: string) =>
    trackEvent('form_submit', { form_type: formType, inquiry_category: category }),

  whatsappClick: (location: string) =>
    trackEvent('whatsapp_click', { click_location: location }),

  emailClick: (location: string) =>
    trackEvent('email_click', { click_location: location }),

  journalClick: (articleSlug: string, articleTitle: string) =>
    trackEvent('journal_click', { article_slug: articleSlug, article_title: articleTitle }),

  outboundClick: (url: string) =>
    trackEvent('outbound_click', { outbound_url: url }),
};

// GTM dataLayer type augmentation
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
