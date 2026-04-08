import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

/** Server-side only: bypasses RLS using the service role key */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _supabaseAdmin;
}

// Table and column names follow the saikiweb prefix convention
export const TABLES = {
  INQUIRIES: 'saikiweb_inquiries',
  ARTICLES: 'saikiweb_articles',
  SEO_CONFIG: 'saikiweb_seo_config',
  SUBSCRIBERS: 'saikiweb_subscribers',
  SOCIAL_POSTS: 'saikiweb_social_posts',
  SHORT_LINKS: 'saikiweb_short_links',
  INVOICES: 'saikiweb_invoices',
  INVOICE_ITEMS: 'saikiweb_invoice_items',
  PAYMENTS: 'saikiweb_payments',
  RECEIPTS: 'saikiweb_receipts',
  DOCUMENTS: 'saikiweb_documents',
} as const;

// Type for the saikiweb_articles table
export interface SaikiwebArticle {
  saikiweb_article_id?: number;
  saikiweb_slug: string;
  saikiweb_locale: string;
  saikiweb_title: string;
  saikiweb_excerpt: string;
  saikiweb_body: string;
  saikiweb_category: string;
  saikiweb_category_key: string;
  saikiweb_date: string;
  saikiweb_read_time: string;
  saikiweb_layout?: string;
  saikiweb_featured: boolean;
  saikiweb_published: boolean;
  saikiweb_meta_title?: string;
  saikiweb_meta_description?: string;
  saikiweb_keywords?: string[];
  saikiweb_created_at?: string;
  saikiweb_updated_at?: string;
}

// Type for the saikiweb_inquiries table
export interface SaikiwebInquiry {
  saikiweb_inquiry_id?: number;
  saikiweb_name: string;
  saikiweb_email: string;
  saikiweb_phone?: string;
  saikiweb_company?: string;
  saikiweb_category: string;
  saikiweb_message: string;
  saikiweb_budget?: string;
  saikiweb_locale: string;
  saikiweb_utm_source?: string;
  saikiweb_utm_medium?: string;
  saikiweb_utm_campaign?: string;
  saikiweb_utm_content?: string;
  saikiweb_utm_term?: string;
  saikiweb_gclid?: string;
  saikiweb_fbclid?: string;
  saikiweb_referrer?: string;
  saikiweb_landing_page?: string;
  saikiweb_current_page?: string;
  saikiweb_visitor_id?: string;
  saikiweb_created_at?: string;
}

// Type for the saikiweb_social_posts table
export interface SaikiwebSocialPost {
  saikiweb_post_id?: number;
  saikiweb_platform: 'instagram' | 'linkedin' | 'tiktok' | 'twitter' | 'facebook';
  saikiweb_post_type: 'single' | 'carousel' | 'reel' | 'story' | 'text';
  saikiweb_caption: string;
  saikiweb_hashtags: string[];
  saikiweb_media_urls: string[];
  saikiweb_locale: string;
  saikiweb_status: 'draft' | 'scheduled' | 'published' | 'archived';
  saikiweb_scheduled_at?: string;
  saikiweb_published_at?: string;
  saikiweb_post_url?: string;
  saikiweb_article_slug?: string;
  saikiweb_category_key?: 'consultancy' | 'imagery' | 'technology' | 'general';
  saikiweb_notes?: string;
  saikiweb_created_at?: string;
  saikiweb_updated_at?: string;
}

// Type for the saikiweb_short_links table
export interface SaikiwebShortLink {
  saikiweb_short_link_id?: number;
  saikiweb_long_url: string;
  saikiweb_short_url: string;
  saikiweb_dub_key?: string;
  saikiweb_dub_domain?: string;
  saikiweb_article_slug?: string;
  saikiweb_platform?: string;
  saikiweb_post_type?: string;
  saikiweb_created_at?: string;
}

// Type for the saikiweb_subscribers table
export interface SaikiwebSubscriber {
  saikiweb_subscriber_id?: number;
  saikiweb_email: string;
  saikiweb_name?: string;
  saikiweb_locale: string;
  saikiweb_status: 'active' | 'unsubscribed';
  saikiweb_unsubscribe_token: string;
  saikiweb_source?: string;
  saikiweb_subscribed_at?: string;
  saikiweb_unsubscribed_at?: string;
}

// Type for saikiweb_invoices table
export type ServiceBrand = 'consultancy' | 'technology' | 'imagery';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';

export interface SaikiwebInvoice {
  saikiweb_invoice_id?: number;
  saikiweb_invoice_number: string;
  saikiweb_service_brand: ServiceBrand;
  saikiweb_status: InvoiceStatus;
  saikiweb_client_name: string;
  saikiweb_client_address: string;
  saikiweb_client_email?: string;
  saikiweb_client_phone?: string;
  saikiweb_issued_date: string;
  saikiweb_due_date?: string;
  saikiweb_subtotal: number;
  saikiweb_tax_percent?: number;
  saikiweb_tax_amount?: number;
  saikiweb_discount_amount?: number;
  saikiweb_grand_total: number;
  saikiweb_currency: string;
  saikiweb_notes?: string;
  saikiweb_payment_bank?: string;
  saikiweb_payment_account?: string;
  saikiweb_payment_recipient?: string;
  saikiweb_signer_name?: string;
  saikiweb_signer_title?: string;
  saikiweb_signed_file_url?: string;
  saikiweb_verification_token?: string;
  saikiweb_sent_at?: string;
  saikiweb_custom_fields?: Record<string, string>;
  saikiweb_reference_docs?: { name: string; url: string }[];
  saikiweb_is_legacy?: boolean;
  saikiweb_legacy_notes?: string;
  saikiweb_related_invoice_id?: number;
  saikiweb_created_at?: string;
  saikiweb_updated_at?: string;
}

// Type for saikiweb_invoice_items table
export interface SaikiwebInvoiceItem {
  saikiweb_item_id?: number;
  saikiweb_invoice_id: number;
  saikiweb_description: string;
  saikiweb_quantity: number;
  saikiweb_unit_price: number;
  saikiweb_subtotal: number;
  saikiweb_sort_order?: number;
}

// Type for saikiweb_payments table
export type PaymentStatus = 'pending' | 'confirmed' | 'failed';

export interface SaikiwebPayment {
  saikiweb_payment_id?: number;
  saikiweb_invoice_id: number;
  saikiweb_amount: number;
  saikiweb_payment_date: string;
  saikiweb_payment_method: string;
  saikiweb_status: PaymentStatus;
  saikiweb_reference?: string;
  saikiweb_notes?: string;
  saikiweb_created_at?: string;
}

// Type for saikiweb_receipts table
export interface SaikiwebReceipt {
  saikiweb_receipt_id?: number;
  saikiweb_receipt_number: string;
  saikiweb_invoice_id?: number;
  saikiweb_payment_id?: number;
  saikiweb_service_brand: ServiceBrand;
  saikiweb_client_name: string;
  saikiweb_client_address: string;
  saikiweb_amount: number;
  saikiweb_amount_words: string;
  saikiweb_currency: string;
  saikiweb_payment_for: string;
  saikiweb_package_value?: number;
  saikiweb_reference?: string;
  saikiweb_payment_method: string;
  saikiweb_receipt_date: string;
  saikiweb_signer_name?: string;
  saikiweb_signer_title?: string;
  saikiweb_verification_token?: string;
  saikiweb_sent_at?: string;
  saikiweb_custom_fields?: Record<string, string>;
  saikiweb_reference_docs?: { name: string; url: string }[];
  saikiweb_stamp_status?: 'not_required' | 'needs_stamp' | 'stamped';
  saikiweb_stamped_file_url?: string;
  saikiweb_is_legacy?: boolean;
  saikiweb_legacy_notes?: string;
  saikiweb_created_at?: string;
}

// Type for saikiweb_documents table (QR code document verification)
export type DocumentStatus = 'active' | 'revoked' | 'expired';
export type DocumentType =
  | 'surat_keputusan'
  | 'sertifikat'
  | 'kontrak'
  | 'surat_keterangan'
  | 'proposal'
  | 'berita_acara'
  | 'surat_tugas'
  | 'lainnya';

export interface DocumentStampEntry {
  stamped_at: string;
  page: number;
  x: number;
  y: number;
  size: number;
  file_url: string;
}

export interface SaikiwebDocument {
  saikiweb_document_id?: number;
  saikiweb_document_number: string;
  saikiweb_document_name: string;
  saikiweb_document_type: DocumentType;
  saikiweb_document_date: string;
  saikiweb_service_brand: ServiceBrand;
  saikiweb_status: DocumentStatus;
  saikiweb_issued_to: string;
  saikiweb_issued_by: string;
  saikiweb_description?: string;
  saikiweb_signer_name?: string;
  saikiweb_signer_title?: string;
  saikiweb_valid_until?: string;
  saikiweb_verification_token: string;
  saikiweb_original_file_url?: string;
  saikiweb_stamped_file_url?: string;
  saikiweb_stamp_history?: DocumentStampEntry[];
  saikiweb_notes?: string;
  saikiweb_created_at?: string;
  saikiweb_updated_at?: string;
}
