-- ============================================================
-- Table: saikiweb_documents
-- Document verification with QR code for SAIKI Group admin panel
-- ============================================================

CREATE TABLE IF NOT EXISTS saikiweb_documents (
  saikiweb_document_id      BIGSERIAL PRIMARY KEY,

  -- Document identification
  saikiweb_document_number  TEXT NOT NULL UNIQUE,
  saikiweb_document_name    TEXT NOT NULL,
  saikiweb_document_type    TEXT NOT NULL DEFAULT 'lainnya'
                            CHECK (saikiweb_document_type IN (
                              'surat_keputusan', 'sertifikat', 'kontrak',
                              'surat_keterangan', 'proposal', 'berita_acara',
                              'surat_tugas', 'lainnya'
                            )),
  saikiweb_document_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  saikiweb_service_brand    TEXT NOT NULL CHECK (saikiweb_service_brand IN ('consultancy', 'technology', 'imagery')),
  saikiweb_status           TEXT NOT NULL DEFAULT 'active'
                            CHECK (saikiweb_status IN ('active', 'revoked', 'expired')),

  -- Issued info
  saikiweb_issued_to        TEXT NOT NULL,
  saikiweb_issued_by        TEXT NOT NULL,
  saikiweb_description      TEXT,

  -- Signer
  saikiweb_signer_name      TEXT,
  saikiweb_signer_title     TEXT,

  -- Validity
  saikiweb_valid_until      DATE,

  -- Verification
  saikiweb_verification_token TEXT NOT NULL UNIQUE,

  -- PDF files
  saikiweb_original_file_url TEXT,
  saikiweb_stamped_file_url  TEXT,
  saikiweb_stamp_history     JSONB DEFAULT '[]'::JSONB,

  -- Additional info
  saikiweb_notes            TEXT,

  -- Timestamps
  saikiweb_created_at       TIMESTAMPTZ DEFAULT NOW(),
  saikiweb_updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_documents_status ON saikiweb_documents (saikiweb_status);
CREATE INDEX IF NOT EXISTS idx_documents_brand ON saikiweb_documents (saikiweb_service_brand);
CREATE INDEX IF NOT EXISTS idx_documents_type ON saikiweb_documents (saikiweb_document_type);
CREATE INDEX IF NOT EXISTS idx_documents_issued_to ON saikiweb_documents (saikiweb_issued_to);
CREATE INDEX IF NOT EXISTS idx_documents_created ON saikiweb_documents (saikiweb_created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_verify ON saikiweb_documents (saikiweb_verification_token);
CREATE INDEX IF NOT EXISTS idx_documents_date ON saikiweb_documents (saikiweb_document_date DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.saikiweb_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON saikiweb_documents
  FOR EACH ROW EXECUTE FUNCTION update_documents_updated_at();


-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE saikiweb_documents ENABLE ROW LEVEL SECURITY;

-- Admin / authenticated full access
CREATE POLICY "Admin full access on documents"
  ON saikiweb_documents FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Service role full access (used by API routes)
CREATE POLICY "Service role full access on documents"
  ON saikiweb_documents FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Public read for verification is handled through API routes
-- that only expose limited data, so no anon policy is needed.
