'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SaikiwebDocument, DocumentStampEntry } from '@/lib/supabase';
import QRCodeLib from 'qrcode';

interface Props {
  document: SaikiwebDocument;
  onClose: () => void;
  onStamped: (doc: SaikiwebDocument) => void;
}

export default function PdfStampModal({ document: doc, onClose, onStamped }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState({ width: 595, height: 842 }); // default A4

  // QR overlay state
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [qrPosition, setQrPosition] = useState({ x: 420, y: 700 }); // bottom-right default
  const [qrSize, setQrSize] = useState(80);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/document?token=${doc.saikiweb_verification_token}`;

  // Container display dimensions (fixed preview size)
  const PREVIEW_WIDTH = 595;
  const displayScale = pageSize.width > 0 ? PREVIEW_WIDTH / pageSize.width : 1;
  const displayHeight = pageSize.height * displayScale;

  // Generate QR code image
  useEffect(() => {
    QRCodeLib.toDataURL(verifyUrl, { width: 400, margin: 1, color: { dark: '#1a1a1a', light: '#ffffff' } })
      .then(setQrImageUrl)
      .catch(() => {});
  }, [verifyUrl]);

  // Load PDF and extract metadata using pdf-lib
  useEffect(() => {
    if (!doc.saikiweb_original_file_url) return;

    const loadPdf = async () => {
      try {
        const response = await fetch(doc.saikiweb_original_file_url!);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        setPdfArrayBuffer(arrayBuffer);

        // Use pdf-lib to get page info
        const { PDFDocument } = await import('pdf-lib');
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        setTotalPages(pages.length);

        if (pages.length > 0) {
          const firstPage = pages[0];
          const { width, height } = firstPage.getSize();
          setPageSize({ width, height });
          // Position QR at bottom-right by default
          setQrPosition({ x: width - 100, y: height - 100 });
        }

        // Create blob URL for preview
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfDataUrl(url);
        setPdfLoaded(true);
      } catch (err) {
        console.error('Failed to load PDF:', err);
        setPdfError('Failed to load PDF file.');
      }
    };
    loadPdf();

    return () => {
      if (pdfDataUrl) URL.revokeObjectURL(pdfDataUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.saikiweb_original_file_url]);

  // Handle QR drag - mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Convert to PDF coordinates
    const pdfX = mx / displayScale;
    const pdfY = my / displayScale;

    if (pdfX >= qrPosition.x && pdfX <= qrPosition.x + qrSize &&
        pdfY >= qrPosition.y && pdfY <= qrPosition.y + qrSize) {
      setIsDragging(true);
      setDragOffset({ x: pdfX - qrPosition.x, y: pdfY - qrPosition.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const pdfX = (e.clientX - rect.left) / displayScale - dragOffset.x;
    const pdfY = (e.clientY - rect.top) / displayScale - dragOffset.y;
    setQrPosition({
      x: Math.max(0, Math.min(pdfX, pageSize.width - qrSize)),
      y: Math.max(0, Math.min(pdfY, pageSize.height - qrSize)),
    });
  }, [isDragging, dragOffset, displayScale, pageSize, qrSize]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle touch drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!overlayRef.current) return;
    const touch = e.touches[0];
    const rect = overlayRef.current.getBoundingClientRect();
    const pdfX = (touch.clientX - rect.left) / displayScale;
    const pdfY = (touch.clientY - rect.top) / displayScale;

    if (pdfX >= qrPosition.x && pdfX <= qrPosition.x + qrSize &&
        pdfY >= qrPosition.y && pdfY <= qrPosition.y + qrSize) {
      setIsDragging(true);
      setDragOffset({ x: pdfX - qrPosition.x, y: pdfY - qrPosition.y });
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !overlayRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = overlayRef.current.getBoundingClientRect();
    const pdfX = (touch.clientX - rect.left) / displayScale - dragOffset.x;
    const pdfY = (touch.clientY - rect.top) / displayScale - dragOffset.y;
    setQrPosition({
      x: Math.max(0, Math.min(pdfX, pageSize.width - qrSize)),
      y: Math.max(0, Math.min(pdfY, pageSize.height - qrSize)),
    });
  }, [isDragging, dragOffset, displayScale, pageSize, qrSize]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleTouchMove, handleMouseUp]);

  // Save stamped PDF using pdf-lib
  const handleStamp = async () => {
    if (!pdfArrayBuffer || !qrImageUrl) return;

    setSaving(true);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDocument = await PDFDocument.load(pdfArrayBuffer);

      const page = pdfDocument.getPage(currentPage - 1);
      const { height: pdfPageHeight } = page.getSize();

      // qrPosition is in PDF points (top-left origin)
      // pdf-lib uses bottom-left origin, so convert Y
      const pdfQrX = qrPosition.x;
      const pdfQrY = pdfPageHeight - qrPosition.y - qrSize;

      // Embed QR code image
      const qrImageBytes = await fetch(qrImageUrl).then(r => r.arrayBuffer());
      const qrImage = await pdfDocument.embedPng(qrImageBytes);

      page.drawImage(qrImage, {
        x: pdfQrX,
        y: pdfQrY,
        width: qrSize,
        height: qrSize,
      });

      const modifiedPdfBytes = await pdfDocument.save();

      // Upload stamped PDF
      const pw = sessionStorage.getItem('admin_pw');
      if (!pw) throw new Error('Not authenticated');

      const blob = new Blob([modifiedPdfBytes as BlobPart], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, `stamped_${doc.saikiweb_document_number.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': pw },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');

      // Update document with stamped file URL and history
      const newStampEntry: DocumentStampEntry = {
        stamped_at: new Date().toISOString(),
        page: currentPage,
        x: qrPosition.x,
        y: qrPosition.y,
        size: qrSize,
        file_url: uploadData.url,
      };

      const existingHistory = doc.saikiweb_stamp_history || [];

      const updateRes = await fetch('/api/admin/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify({
          saikiweb_document_id: doc.saikiweb_document_id,
          saikiweb_stamped_file_url: uploadData.url,
          saikiweb_stamp_history: [newStampEntry, ...existingHistory],
        }),
      });

      const updateData = await updateRes.json();
      if (updateData.success) {
        onStamped(updateData.data);
      } else {
        throw new Error(updateData.error || 'Failed to update document');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stamp PDF');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Stamp QR Code on PDF</h2>
            <p className="text-xs text-gray-500 mt-0.5">Drag the QR code to position it on the document, then save</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">Prev</button>
                <span className="text-sm text-gray-600">Page {currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">Next</button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">QR Size:</label>
              <input
                type="range"
                min={30}
                max={200}
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-32 accent-teal-600"
              />
              <span className="text-sm text-gray-500 w-10">{qrSize}pt</span>
            </div>

            {totalPages > 0 && (
              <span className="text-xs text-gray-400">
                Page size: {Math.round(pageSize.width)} x {Math.round(pageSize.height)} pt
              </span>
            )}
          </div>

          {/* PDF Preview with QR Overlay */}
          <div ref={containerRef} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100">
            {pdfError ? (
              <div className="p-16 text-center">
                <p className="text-red-500 text-sm">{pdfError}</p>
              </div>
            ) : !pdfLoaded ? (
              <div className="p-16 text-center">
                <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Loading PDF...</p>
              </div>
            ) : (
              <div className="relative mx-auto" style={{ width: PREVIEW_WIDTH, height: displayHeight }}>
                {/* PDF rendered by browser via embed */}
                <embed
                  src={`${pdfDataUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
                  type="application/pdf"
                  style={{ width: PREVIEW_WIDTH, height: displayHeight, border: 'none' }}
                />
                {/* Transparent overlay for drag interaction */}
                <div
                  ref={overlayRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    cursor: isDragging ? 'grabbing' : 'default',
                    zIndex: 10,
                  }}
                >
                  {/* QR Code draggable element */}
                  {qrImageUrl && (
                    <div
                      style={{
                        position: 'absolute',
                        left: qrPosition.x * displayScale,
                        top: qrPosition.y * displayScale,
                        width: qrSize * displayScale,
                        height: qrSize * displayScale,
                        cursor: isDragging ? 'grabbing' : 'grab',
                        border: '2px dashed #0d9488',
                        borderRadius: 4,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        backgroundColor: 'white',
                        padding: 2,
                        zIndex: 20,
                      }}
                    >
                      <img src={qrImageUrl} alt="QR Code" style={{ width: '100%', height: '100%', pointerEvents: 'none', display: 'block' }} draggable={false} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button
              onClick={handleStamp}
              disabled={saving || !pdfLoaded || !qrImageUrl}
              className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Stamping...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Stamp & Save PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
