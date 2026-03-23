-- Add visitor_id column to saikiweb_inquiries table
-- Run this in Supabase SQL Editor

ALTER TABLE saikiweb_inquiries
ADD COLUMN IF NOT EXISTS saikiweb_visitor_id TEXT;

-- Index for looking up all inquiries from the same visitor
CREATE INDEX IF NOT EXISTS idx_inquiries_visitor_id
ON saikiweb_inquiries (saikiweb_visitor_id)
WHERE saikiweb_visitor_id IS NOT NULL;

COMMENT ON COLUMN saikiweb_inquiries.saikiweb_visitor_id IS 'Cookie-based visitor ID (saiki_vid), persists 365 days';
