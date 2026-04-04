-- ============================================================
-- Finance Tables: Invoices, Invoice Items, Payments, Receipts
-- Invoice & Receipt management for SAIKI Group admin panel
-- ============================================================


-- ============================================================
-- Table: saikiweb_invoices
-- ============================================================

CREATE TABLE IF NOT EXISTS saikiweb_invoices (
  saikiweb_invoice_id       BIGSERIAL PRIMARY KEY,

  -- Invoice identification
  saikiweb_invoice_number   TEXT NOT NULL UNIQUE,
  saikiweb_service_brand    TEXT NOT NULL CHECK (saikiweb_service_brand IN ('consultancy', 'technology', 'imagery')),
  saikiweb_status           TEXT NOT NULL DEFAULT 'draft'
                            CHECK (saikiweb_status IN ('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled')),

  -- Client information
  saikiweb_client_name      TEXT NOT NULL,
  saikiweb_client_address   TEXT NOT NULL,
  saikiweb_client_email     TEXT,
  saikiweb_client_phone     TEXT,

  -- Dates
  saikiweb_issued_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  saikiweb_due_date         DATE,

  -- Amounts
  saikiweb_subtotal         NUMERIC(15,2) NOT NULL DEFAULT 0,
  saikiweb_tax_percent      NUMERIC(5,2) DEFAULT 0,
  saikiweb_tax_amount       NUMERIC(15,2) DEFAULT 0,
  saikiweb_discount_amount  NUMERIC(15,2) DEFAULT 0,
  saikiweb_grand_total      NUMERIC(15,2) NOT NULL DEFAULT 0,
  saikiweb_currency         TEXT NOT NULL DEFAULT 'IDR',

  -- Additional info
  saikiweb_notes            TEXT,
  saikiweb_payment_bank     TEXT,
  saikiweb_payment_account  TEXT,
  saikiweb_payment_recipient TEXT,
  saikiweb_signer_name      TEXT,

  -- Verification & tracking
  saikiweb_verification_token TEXT UNIQUE,
  saikiweb_sent_at          TIMESTAMPTZ,
  saikiweb_custom_fields    JSONB,

  -- Legacy / historical data (for pre-system invoices)
  saikiweb_is_legacy        BOOLEAN DEFAULT FALSE,
  saikiweb_legacy_notes     TEXT,
  saikiweb_related_invoice_id BIGINT REFERENCES saikiweb_invoices(saikiweb_invoice_id) ON DELETE SET NULL,

  -- Timestamps
  saikiweb_created_at       TIMESTAMPTZ DEFAULT NOW(),
  saikiweb_updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoices_status ON saikiweb_invoices (saikiweb_status);
CREATE INDEX IF NOT EXISTS idx_invoices_brand ON saikiweb_invoices (saikiweb_service_brand);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON saikiweb_invoices (saikiweb_client_name);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON saikiweb_invoices (saikiweb_created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_verify ON saikiweb_invoices (saikiweb_verification_token);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.saikiweb_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON saikiweb_invoices
  FOR EACH ROW EXECUTE FUNCTION update_invoices_updated_at();


-- ============================================================
-- Table: saikiweb_invoice_items
-- ============================================================

CREATE TABLE IF NOT EXISTS saikiweb_invoice_items (
  saikiweb_item_id          BIGSERIAL PRIMARY KEY,
  saikiweb_invoice_id       BIGINT NOT NULL REFERENCES saikiweb_invoices(saikiweb_invoice_id) ON DELETE CASCADE,

  saikiweb_description      TEXT NOT NULL,
  saikiweb_quantity          NUMERIC(10,2) NOT NULL DEFAULT 1,
  saikiweb_unit_price       NUMERIC(15,2) NOT NULL DEFAULT 0,
  saikiweb_subtotal         NUMERIC(15,2) NOT NULL DEFAULT 0,
  saikiweb_sort_order       INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON saikiweb_invoice_items (saikiweb_invoice_id);


-- ============================================================
-- Table: saikiweb_payments
-- ============================================================

CREATE TABLE IF NOT EXISTS saikiweb_payments (
  saikiweb_payment_id       BIGSERIAL PRIMARY KEY,
  saikiweb_invoice_id       BIGINT NOT NULL REFERENCES saikiweb_invoices(saikiweb_invoice_id) ON DELETE CASCADE,

  saikiweb_amount           NUMERIC(15,2) NOT NULL,
  saikiweb_payment_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  saikiweb_payment_method   TEXT NOT NULL DEFAULT 'Bank transfer',
  saikiweb_status           TEXT NOT NULL DEFAULT 'pending'
                            CHECK (saikiweb_status IN ('pending', 'confirmed', 'failed')),
  saikiweb_reference        TEXT,
  saikiweb_notes            TEXT,

  saikiweb_created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice ON saikiweb_payments (saikiweb_invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON saikiweb_payments (saikiweb_status);
CREATE INDEX IF NOT EXISTS idx_payments_created ON saikiweb_payments (saikiweb_created_at DESC);


-- ============================================================
-- Table: saikiweb_receipts
-- ============================================================

CREATE TABLE IF NOT EXISTS saikiweb_receipts (
  saikiweb_receipt_id       BIGSERIAL PRIMARY KEY,

  -- Receipt identification
  saikiweb_receipt_number   TEXT NOT NULL UNIQUE,
  saikiweb_invoice_id       BIGINT REFERENCES saikiweb_invoices(saikiweb_invoice_id) ON DELETE SET NULL,
  saikiweb_payment_id       BIGINT REFERENCES saikiweb_payments(saikiweb_payment_id) ON DELETE SET NULL,
  saikiweb_service_brand    TEXT NOT NULL CHECK (saikiweb_service_brand IN ('consultancy', 'technology', 'imagery')),

  -- Client information
  saikiweb_client_name      TEXT NOT NULL,
  saikiweb_client_address   TEXT NOT NULL,

  -- Amount
  saikiweb_amount           NUMERIC(15,2) NOT NULL,
  saikiweb_amount_words     TEXT NOT NULL,
  saikiweb_currency         TEXT NOT NULL DEFAULT 'IDR',

  -- Payment details
  saikiweb_payment_for      TEXT NOT NULL,
  saikiweb_package_value    NUMERIC(15,2),
  saikiweb_reference        TEXT,
  saikiweb_payment_method   TEXT NOT NULL DEFAULT 'Bank transfer',
  saikiweb_receipt_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  saikiweb_signer_name      TEXT,

  -- Verification & tracking
  saikiweb_verification_token TEXT UNIQUE,
  saikiweb_sent_at          TIMESTAMPTZ,
  saikiweb_custom_fields    JSONB,

  -- E-Meterai (for receipts >= 5,000,000 IDR)
  saikiweb_stamp_status     TEXT DEFAULT 'not_required'
                            CHECK (saikiweb_stamp_status IN ('not_required', 'needs_stamp', 'stamped')),
  saikiweb_stamped_file_url TEXT,

  -- Legacy / historical data (for pre-system receipts)
  saikiweb_is_legacy        BOOLEAN DEFAULT FALSE,
  saikiweb_legacy_notes     TEXT,

  -- Timestamps
  saikiweb_created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_receipts_invoice ON saikiweb_receipts (saikiweb_invoice_id);
CREATE INDEX IF NOT EXISTS idx_receipts_client ON saikiweb_receipts (saikiweb_client_name);
CREATE INDEX IF NOT EXISTS idx_receipts_created ON saikiweb_receipts (saikiweb_created_at DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_verify ON saikiweb_receipts (saikiweb_verification_token);
CREATE INDEX IF NOT EXISTS idx_receipts_stamp ON saikiweb_receipts (saikiweb_stamp_status);


-- ============================================================
-- Row Level Security (all tables - admin only)
-- ============================================================

ALTER TABLE saikiweb_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE saikiweb_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saikiweb_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE saikiweb_receipts ENABLE ROW LEVEL SECURITY;

-- Invoices
CREATE POLICY "Admin full access on invoices"
  ON saikiweb_invoices FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on invoices"
  ON saikiweb_invoices FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Invoice Items
CREATE POLICY "Admin full access on invoice_items"
  ON saikiweb_invoice_items FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on invoice_items"
  ON saikiweb_invoice_items FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Payments
CREATE POLICY "Admin full access on payments"
  ON saikiweb_payments FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on payments"
  ON saikiweb_payments FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Receipts
CREATE POLICY "Admin full access on receipts"
  ON saikiweb_receipts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on receipts"
  ON saikiweb_receipts FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Public read for verification (limited columns via API, not direct table access)
-- Verification is handled through API routes that only expose limited data,
-- so no anon policy is needed on the tables themselves.


-- ============================================================
-- Supabase Storage Bucket for stamped documents
-- ============================================================
-- Run this in Supabase SQL editor or create via dashboard:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('finance-documents', 'finance-documents', true)
-- ON CONFLICT (id) DO NOTHING;
