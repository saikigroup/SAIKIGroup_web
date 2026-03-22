-- Supabase SQL: Create saikiweb_articles table
-- Run this in Supabase SQL Editor
-- Admin API uses service_role key which bypasses RLS entirely,
-- so policies below are only for direct Supabase client access.

CREATE TABLE IF NOT EXISTS saikiweb_articles (
  saikiweb_article_id BIGSERIAL PRIMARY KEY,
  saikiweb_slug TEXT NOT NULL,
  saikiweb_locale TEXT NOT NULL DEFAULT 'id',
  saikiweb_title TEXT NOT NULL,
  saikiweb_excerpt TEXT NOT NULL,
  saikiweb_body TEXT NOT NULL,
  saikiweb_category TEXT NOT NULL,
  saikiweb_category_key TEXT NOT NULL,
  saikiweb_date TEXT NOT NULL,
  saikiweb_read_time TEXT NOT NULL,
  saikiweb_layout TEXT DEFAULT 'editorial',
  saikiweb_featured BOOLEAN DEFAULT false,
  saikiweb_published BOOLEAN DEFAULT false,
  saikiweb_meta_title TEXT,
  saikiweb_meta_description TEXT,
  saikiweb_keywords TEXT[],
  saikiweb_created_at TIMESTAMPTZ DEFAULT NOW(),
  saikiweb_updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(saikiweb_slug, saikiweb_locale)
);

-- Enable Row Level Security
ALTER TABLE saikiweb_articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running this script
DROP POLICY IF EXISTS "Allow public reads for published articles" ON saikiweb_articles;
DROP POLICY IF EXISTS "Allow service role full access" ON saikiweb_articles;
DROP POLICY IF EXISTS "Allow authenticated full access" ON saikiweb_articles;
DROP POLICY IF EXISTS "Allow anon reads for published" ON saikiweb_articles;

-- Policy: Allow anonymous reads for published articles (public website)
CREATE POLICY "Allow anon reads for published" ON saikiweb_articles
  FOR SELECT
  TO anon
  USING (saikiweb_published = true);

-- Policy: Allow authenticated users full read access
CREATE POLICY "Allow authenticated full access" ON saikiweb_articles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow service role full access (admin API uses this)
-- Note: service_role bypasses RLS by default, but adding for clarity
CREATE POLICY "Allow service role full access" ON saikiweb_articles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Index on slug + locale for fast lookups
CREATE INDEX IF NOT EXISTS idx_saikiweb_articles_slug_locale
  ON saikiweb_articles (saikiweb_slug, saikiweb_locale);

-- Index on locale + published for listing
CREATE INDEX IF NOT EXISTS idx_saikiweb_articles_locale_published
  ON saikiweb_articles (saikiweb_locale, saikiweb_published);

-- Index on category_key for filtering
CREATE INDEX IF NOT EXISTS idx_saikiweb_articles_category_key
  ON saikiweb_articles (saikiweb_category_key);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_saikiweb_articles_created_at
  ON saikiweb_articles (saikiweb_created_at DESC);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saikiweb_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.saikiweb_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_saikiweb_articles_updated_at ON saikiweb_articles;
CREATE TRIGGER trigger_saikiweb_articles_updated_at
  BEFORE UPDATE ON saikiweb_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_saikiweb_articles_updated_at();
