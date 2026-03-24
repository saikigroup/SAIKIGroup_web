-- ============================================================
-- Table: saikiweb_short_links
-- Cache for Dub.co shortened URLs to avoid re-creating links
-- ============================================================

CREATE TABLE IF NOT EXISTS saikiweb_short_links (
  saikiweb_short_link_id  SERIAL PRIMARY KEY,

  -- The full destination URL (with UTM params)
  saikiweb_long_url       TEXT NOT NULL,

  -- The shortened URL (e.g. https://s.saiki.id/abc123)
  saikiweb_short_url      TEXT NOT NULL,

  -- Dub.co metadata
  saikiweb_dub_key        TEXT,            -- slug part (e.g. "abc123")
  saikiweb_dub_domain     TEXT,            -- domain (e.g. "s.saiki.id")

  -- Context: which article + platform + postType produced this link
  saikiweb_article_slug   TEXT,
  saikiweb_platform       TEXT,            -- instagram, linkedin, etc.
  saikiweb_post_type      TEXT,            -- single, carousel, reel, etc.

  saikiweb_created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one short link per long URL
-- (same article+platform+postType always produces same UTM → same long_url)
CREATE UNIQUE INDEX IF NOT EXISTS idx_short_links_long_url
  ON saikiweb_short_links (saikiweb_long_url);

-- Fast lookup by article slug (show all short links for an article)
CREATE INDEX IF NOT EXISTS idx_short_links_article
  ON saikiweb_short_links (saikiweb_article_slug);

-- Composite lookup: article + platform + postType
CREATE INDEX IF NOT EXISTS idx_short_links_context
  ON saikiweb_short_links (saikiweb_article_slug, saikiweb_platform, saikiweb_post_type);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE saikiweb_short_links ENABLE ROW LEVEL SECURITY;

-- Only authenticated/service role can access (admin only)
CREATE POLICY "Admin full access on short_links"
  ON saikiweb_short_links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on short_links"
  ON saikiweb_short_links
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
