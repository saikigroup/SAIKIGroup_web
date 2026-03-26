-- Migration: Add translation_slug column to saikiweb_articles
-- This column stores the slug of the same article in the other locale,
-- enabling proper language switching for dynamic (Supabase) articles.
-- Run this in Supabase SQL Editor.

ALTER TABLE saikiweb_articles
ADD COLUMN IF NOT EXISTS saikiweb_translation_slug TEXT;

-- Index for fast lookup when resolving translation slugs
CREATE INDEX IF NOT EXISTS idx_saikiweb_articles_translation_slug
  ON saikiweb_articles (saikiweb_translation_slug);
