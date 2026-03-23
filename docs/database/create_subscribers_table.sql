-- Create saikiweb_subscribers table for newsletter/insight subscriptions
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS saikiweb_subscribers (
  saikiweb_subscriber_id SERIAL PRIMARY KEY,
  saikiweb_email TEXT NOT NULL,
  saikiweb_name TEXT,
  saikiweb_locale TEXT NOT NULL DEFAULT 'id',
  saikiweb_status TEXT NOT NULL DEFAULT 'active' CHECK (saikiweb_status IN ('active', 'unsubscribed')),
  saikiweb_unsubscribe_token TEXT NOT NULL UNIQUE,
  saikiweb_source TEXT DEFAULT 'contact_form',
  saikiweb_subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  saikiweb_unsubscribed_at TIMESTAMPTZ,
  UNIQUE(saikiweb_email)
);

-- Enable Row Level Security
ALTER TABLE saikiweb_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for the subscribe form)
CREATE POLICY "Allow anonymous inserts" ON saikiweb_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous selects (for checking existing + locale lookup on unsubscribe)
CREATE POLICY "Allow anonymous selects" ON saikiweb_subscribers
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow anonymous updates (for unsubscribe via token)
CREATE POLICY "Allow anonymous unsubscribe" ON saikiweb_subscribers
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated full access (for admin)
CREATE POLICY "Allow authenticated reads" ON saikiweb_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated updates" ON saikiweb_subscribers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index for fast unsubscribe token lookup
CREATE INDEX IF NOT EXISTS idx_subscribers_token
ON saikiweb_subscribers (saikiweb_unsubscribe_token);

-- Index for active subscribers (used when sending newsletter)
CREATE INDEX IF NOT EXISTS idx_subscribers_active
ON saikiweb_subscribers (saikiweb_status) WHERE saikiweb_status = 'active';

COMMENT ON TABLE saikiweb_subscribers IS 'Newsletter subscribers who opted in after contact form submission';
