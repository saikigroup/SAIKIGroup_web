-- Backfill: Set translation_slug for existing article pairs
-- Run this AFTER running add_translation_slug_column.sql

-- ID → EN (set translation_slug on ID articles pointing to EN slug)
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'brand-identity-is-not-a-logo'         WHERE saikiweb_slug = 'brand-identity-bukan-logo'            AND saikiweb_locale = 'id';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'visual-consistency-multi-platform'     WHERE saikiweb_slug = 'konsistensi-visual-multi-platform'    AND saikiweb_locale = 'id';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'data-driven-beyond-dashboards'         WHERE saikiweb_slug = 'data-driven-bukan-cuma-dashboard'     AND saikiweb_locale = 'id';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'skill-gap-analysis-for-professionals'  WHERE saikiweb_slug = 'skill-gap-analysis-untuk-profesional' AND saikiweb_locale = 'id';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'why-personal-branding-matters'         WHERE saikiweb_slug = 'mengapa-personal-branding-penting'    AND saikiweb_locale = 'id';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'color-psychology-in-branding'          WHERE saikiweb_slug = 'psikologi-warna-dalam-branding'       AND saikiweb_locale = 'id';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'custom-vs-off-the-shelf'               WHERE saikiweb_slug = 'custom-vs-off-the-shelf'              AND saikiweb_locale = 'id';

-- EN → ID (set translation_slug on EN articles pointing to ID slug)
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'brand-identity-bukan-logo'             WHERE saikiweb_slug = 'brand-identity-is-not-a-logo'         AND saikiweb_locale = 'en';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'konsistensi-visual-multi-platform'     WHERE saikiweb_slug = 'visual-consistency-multi-platform'    AND saikiweb_locale = 'en';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'data-driven-bukan-cuma-dashboard'      WHERE saikiweb_slug = 'data-driven-beyond-dashboards'        AND saikiweb_locale = 'en';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'skill-gap-analysis-untuk-profesional'  WHERE saikiweb_slug = 'skill-gap-analysis-for-professionals' AND saikiweb_locale = 'en';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'mengapa-personal-branding-penting'     WHERE saikiweb_slug = 'why-personal-branding-matters'        AND saikiweb_locale = 'en';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'psikologi-warna-dalam-branding'        WHERE saikiweb_slug = 'color-psychology-in-branding'         AND saikiweb_locale = 'en';
UPDATE saikiweb_articles SET saikiweb_translation_slug = 'custom-vs-off-the-shelf'               WHERE saikiweb_slug = 'custom-vs-off-the-shelf'              AND saikiweb_locale = 'en';

-- Verify
SELECT saikiweb_slug, saikiweb_locale, saikiweb_translation_slug
FROM saikiweb_articles
ORDER BY saikiweb_slug, saikiweb_locale;
