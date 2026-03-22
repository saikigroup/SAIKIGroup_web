-- Supabase SQL: Create saikiweb_inquiries table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS saikiweb_inquiries (
  saikiweb_inquiry_id BIGSERIAL PRIMARY KEY,
  saikiweb_name TEXT NOT NULL,
  saikiweb_email TEXT NOT NULL,
  saikiweb_phone TEXT,
  saikiweb_company TEXT,
  saikiweb_category TEXT NOT NULL,
  saikiweb_message TEXT NOT NULL,
  saikiweb_budget TEXT,
  saikiweb_locale TEXT DEFAULT 'id',
  saikiweb_utm_source TEXT,
  saikiweb_utm_medium TEXT,
  saikiweb_utm_campaign TEXT,
  saikiweb_utm_content TEXT,
  saikiweb_utm_term TEXT,
  saikiweb_gclid TEXT,
  saikiweb_fbclid TEXT,
  saikiweb_referrer TEXT,
  saikiweb_landing_page TEXT,
  saikiweb_current_page TEXT,
  saikiweb_created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saikiweb_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for the contact form)
CREATE POLICY "Allow anonymous inserts" ON saikiweb_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON saikiweb_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Index on category for filtering
CREATE INDEX IF NOT EXISTS idx_saikiweb_inquiries_category
  ON saikiweb_inquiries (saikiweb_category);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_saikiweb_inquiries_created_at
  ON saikiweb_inquiries (saikiweb_created_at DESC);

-- Index on email for lookup
CREATE INDEX IF NOT EXISTS idx_saikiweb_inquiries_email
  ON saikiweb_inquiries (saikiweb_email);
