-- Create saikiweb_social_posts table for cross-platform social media content management
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS saikiweb_social_posts (
  saikiweb_post_id SERIAL PRIMARY KEY,
  saikiweb_platform TEXT NOT NULL CHECK (saikiweb_platform IN ('instagram', 'linkedin', 'tiktok', 'twitter', 'facebook')),
  saikiweb_post_type TEXT NOT NULL DEFAULT 'single' CHECK (saikiweb_post_type IN ('single', 'carousel', 'reel', 'story', 'text')),
  saikiweb_caption TEXT NOT NULL,
  saikiweb_hashtags TEXT[] DEFAULT '{}',
  saikiweb_media_urls TEXT[] DEFAULT '{}',
  saikiweb_locale TEXT NOT NULL DEFAULT 'id',
  saikiweb_status TEXT NOT NULL DEFAULT 'draft' CHECK (saikiweb_status IN ('draft', 'scheduled', 'published', 'archived')),
  saikiweb_scheduled_at TIMESTAMPTZ,
  saikiweb_published_at TIMESTAMPTZ,
  saikiweb_post_url TEXT,
  saikiweb_article_slug TEXT,
  saikiweb_category_key TEXT CHECK (saikiweb_category_key IN ('consultancy', 'imagery', 'technology', 'general')),
  saikiweb_notes TEXT,
  saikiweb_created_at TIMESTAMPTZ DEFAULT NOW(),
  saikiweb_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saikiweb_social_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated full access (admin only, uses service role key)
CREATE POLICY "Allow authenticated reads" ON saikiweb_social_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated inserts" ON saikiweb_social_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated updates" ON saikiweb_social_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated deletes" ON saikiweb_social_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_social_posts_platform
ON saikiweb_social_posts (saikiweb_platform);

CREATE INDEX IF NOT EXISTS idx_social_posts_status
ON saikiweb_social_posts (saikiweb_status);

CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled
ON saikiweb_social_posts (saikiweb_scheduled_at)
WHERE saikiweb_status = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_social_posts_article
ON saikiweb_social_posts (saikiweb_article_slug)
WHERE saikiweb_article_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_social_posts_created
ON saikiweb_social_posts (saikiweb_created_at DESC);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_social_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.saikiweb_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_social_posts_updated_at
  BEFORE UPDATE ON saikiweb_social_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_social_posts_updated_at();

COMMENT ON TABLE saikiweb_social_posts IS 'Cross-platform social media content management for admin portal';
