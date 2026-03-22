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
  saikiweb_created_at?: string;
}
