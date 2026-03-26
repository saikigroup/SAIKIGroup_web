-- Backfill: Set translation_slug for existing article pairs
-- This links ID ↔ EN articles that share the same category_key and date.
-- Run this AFTER running add_translation_slug_column.sql
--
-- Strategy: Match articles across locales by category_key + date (same article, different locale).
-- If you have articles paired differently, adjust the WHERE clause or run manual UPDATEs.

-- Step 1: Link ID articles → EN slugs
UPDATE saikiweb_articles id_art
SET saikiweb_translation_slug = en_art.saikiweb_slug
FROM saikiweb_articles en_art
WHERE id_art.saikiweb_locale = 'id'
  AND en_art.saikiweb_locale = 'en'
  AND id_art.saikiweb_category_key = en_art.saikiweb_category_key
  AND id_art.saikiweb_date = en_art.saikiweb_date
  AND id_art.saikiweb_translation_slug IS NULL;

-- Step 2: Link EN articles → ID slugs
UPDATE saikiweb_articles en_art
SET saikiweb_translation_slug = id_art.saikiweb_slug
FROM saikiweb_articles id_art
WHERE en_art.saikiweb_locale = 'en'
  AND id_art.saikiweb_locale = 'id'
  AND en_art.saikiweb_category_key = id_art.saikiweb_category_key
  AND en_art.saikiweb_date = id_art.saikiweb_date
  AND en_art.saikiweb_translation_slug IS NULL;

-- Verify: Check which articles now have translation links
SELECT
  saikiweb_slug,
  saikiweb_locale,
  saikiweb_translation_slug,
  saikiweb_title
FROM saikiweb_articles
ORDER BY saikiweb_date DESC, saikiweb_locale;
