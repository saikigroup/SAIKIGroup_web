import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Table and column names follow the saikiweb prefix convention
export const TABLES = {
  INQUIRIES: 'saikiweb_inquiries',
} as const;

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
