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

-- Index for fast unsubscribe token lookup
CREATE INDEX IF NOT EXISTS idx_subscribers_token
ON saikiweb_subscribers (saikiweb_unsubscribe_token);

-- Index for active subscribers (used when sending newsletter)
CREATE INDEX IF NOT EXISTS idx_subscribers_active
ON saikiweb_subscribers (saikiweb_status) WHERE saikiweb_status = 'active';

COMMENT ON TABLE saikiweb_subscribers IS 'Newsletter subscribers who opted in after contact form submission';
