-- ============================================================
-- ALTER: Add legacy/historical and signer columns to finance tables
-- Run this AFTER create_finance_tables.sql if tables already exist
-- ============================================================

-- === saikiweb_invoices: add legacy + signer + related invoice ===
ALTER TABLE saikiweb_invoices
  ADD COLUMN IF NOT EXISTS saikiweb_signer_name TEXT,
  ADD COLUMN IF NOT EXISTS saikiweb_signer_title TEXT,
  ADD COLUMN IF NOT EXISTS saikiweb_is_legacy BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS saikiweb_legacy_notes TEXT,
  ADD COLUMN IF NOT EXISTS saikiweb_related_invoice_id BIGINT REFERENCES saikiweb_invoices(saikiweb_invoice_id) ON DELETE SET NULL;

-- === saikiweb_receipts: add legacy + signer + stamp fields ===
ALTER TABLE saikiweb_receipts
  ADD COLUMN IF NOT EXISTS saikiweb_signer_name TEXT,
  ADD COLUMN IF NOT EXISTS saikiweb_signer_title TEXT,
  ADD COLUMN IF NOT EXISTS saikiweb_is_legacy BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS saikiweb_legacy_notes TEXT,
  ADD COLUMN IF NOT EXISTS saikiweb_stamp_status TEXT DEFAULT 'not_required'
    CHECK (saikiweb_stamp_status IN ('not_required', 'needs_stamp', 'stamped')),
  ADD COLUMN IF NOT EXISTS saikiweb_stamped_file_url TEXT;

-- Index for stamp status filtering
CREATE INDEX IF NOT EXISTS idx_receipts_stamp ON saikiweb_receipts (saikiweb_stamp_status);
