'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SaikiwebDocument, DocumentStampEntry } from '@/lib/supabase';
import QRCodeLib from 'qrcode';

type PdfjsLib = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
type PDFDocumentProxy = import('pdfjs-dist/legacy/build/pdf.mjs').PDFDocumentProxy;

interface Props {
  document: SaikiwebDocument;
  onClose: () => void;
  onStamped: (doc: SaikiwebDocument) => void;
}

export default function PdfStampModal({ document: doc, onClose, onStamped }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const pdfjsRef = useRef<PdfjsLib | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRendered, setPageRendered] = useState(false);
  const [scale, setScale] = useState(1);

  // QR overlay state
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [qrPosition, setQrPosition] = useState({ x: 50, y: 50 });
  const [qrSize, setQrSize] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // PDF page dimensions (in PDF points)
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/document?token=${doc.saikiweb_verification_token}`;

  // Generate QR code image
  useEffect(() => {
    QRCodeLib.toDataURL(verifyUrl, { width: 400, margin: 1, color: { dark: '#1a1a1a', light: '#ffffff' } })
      .then(setQrImageUrl)
      .catch(() => {});
  }, [verifyUrl]);

  // Load PDF (fetch as ArrayBuffer first to avoid CORS, then pass to pdfjs)
  useEffect(() => {
    if (!doc.saikiweb_original_file_url) return;

    const loadPdf = async () => {
      try {
        // Fetch PDF as binary data first (avoids CORS issues with pdfjs direct URL loading)
        const response = await fetch(doc.saikiweb_original_file_url!);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();

        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
        pdfjsRef.current = pdfjs;

        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('Failed to load PDF:', err);
        setError('Failed to load PDF file. Check that the file URL is accessible.');
      }
    };
    loadPdf();
  }, [doc.saikiweb_original_file_url]);

  // Render current page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setPageWidth(viewport.width);
      setPageHeight(viewport.height);

      await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;
      setPageRendered(true);
    } catch (err) {
      console.error('Failed to render page:', err);
    }
  }, [pdfDoc, currentPage, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  // Auto-fit scale
  useEffect(() => {
    if (!pdfDoc || !containerRef.current) return;
    const fitScale = async () => {
      const page = await pdfDoc.getPage(1);
      const baseViewport = page.getViewport({ scale: 1 });
      const containerWidth = containerRef.current!.clientWidth - 48; // padding
      const newScale = Math.min(containerWidth / baseViewport.width, 1.5);
      setScale(newScale);
    };
    fitScale();
  }, [pdfDoc]);

  // Handle QR drag
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= qrPosition.x && x <= qrPosition.x + qrSize && y >= qrPosition.y && y <= qrPosition.y + qrSize) {
      setIsDragging(true);
      setDragOffset({ x: x - qrPosition.x, y: y - qrPosition.y });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, pageWidth - qrSize));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, pageHeight - qrSize));
    setQrPosition({ x, y });
  }, [isDragging, dragOffset, pageWidth, pageHeight, qrSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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

  // Handle touch drag for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (x >= qrPosition.x && x <= qrPosition.x + qrSize && y >= qrPosition.y && y <= qrPosition.y + qrSize) {
      setIsDragging(true);
      setDragOffset({ x: x - qrPosition.x, y: y - qrPosition.y });
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !canvasRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left - dragOffset.x, pageWidth - qrSize));
    const y = Math.max(0, Math.min(touch.clientY - rect.top - dragOffset.y, pageHeight - qrSize));
    setQrPosition({ x, y });
  }, [isDragging, dragOffset, pageWidth, pageHeight, qrSize]);

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

  // Save stamped PDF
  const handleStamp = async () => {
    if (!doc.saikiweb_original_file_url || !qrImageUrl) return;

    setSaving(true);
    setError('');

    try {
      // Fetch original PDF (dynamic import pdf-lib)
      const { PDFDocument } = await import('pdf-lib');
      const pdfBytes = await fetch(doc.saikiweb_original_file_url).then(r => r.arrayBuffer());
      const pdfDocument = await PDFDocument.load(pdfBytes);

      // Get the target page
      const page = pdfDocument.getPage(currentPage - 1);
      const { width: pdfPageWidth, height: pdfPageHeight } = page.getSize();

      // Convert screen coordinates to PDF coordinates
      const scaleX = pdfPageWidth / pageWidth;
      const scaleY = pdfPageHeight / pageHeight;
      const pdfQrX = qrPosition.x * scaleX;
      // PDF Y is from bottom, screen Y is from top
      const pdfQrY = pdfPageHeight - (qrPosition.y + qrSize) * scaleY;
      const pdfQrSize = qrSize * scaleX;

      // Embed QR code image
      const qrImageBytes = await fetch(qrImageUrl).then(r => r.arrayBuffer());
      const qrImage = await pdfDocument.embedPng(qrImageBytes);

      page.drawImage(qrImage, {
        x: pdfQrX,
        y: pdfQrY,
        width: pdfQrSize,
        height: pdfQrSize,
      });

      // Save modified PDF
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
            <p className="text-xs text-gray-500 mt-0.5">Drag the QR code to position it on the document</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Page Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">Prev</button>
                <span className="text-sm text-gray-600">Page {currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">Next</button>
              </div>
            )}

            {/* QR Size */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">QR Size:</label>
              <input
                type="range"
                min={40}
                max={200}
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-32 accent-teal-600"
              />
              <span className="text-sm text-gray-500 w-10">{qrSize}px</span>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Zoom:</label>
              <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">-</button>
              <span className="text-sm text-gray-500 w-12 text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">+</button>
            </div>
          </div>

          {/* PDF Canvas with QR Overlay */}
          <div ref={containerRef} className="relative border border-gray-200 rounded-xl overflow-auto bg-gray-100" style={{ maxHeight: '60vh' }}>
            {!pdfDoc ? (
              <div className="p-16 text-center">
                <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Loading PDF...</p>
              </div>
            ) : (
              <div
                className="relative inline-block"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                style={{ cursor: isDragging ? 'grabbing' : 'default' }}
              >
                <canvas ref={canvasRef} className="block" />
                {/* QR Overlay */}
                {pageRendered && qrImageUrl && (
                  <div
                    style={{
                      position: 'absolute',
                      left: qrPosition.x,
                      top: qrPosition.y,
                      width: qrSize,
                      height: qrSize,
                      cursor: isDragging ? 'grabbing' : 'grab',
                      border: '2px dashed #0d9488',
                      borderRadius: 4,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      backgroundColor: 'white',
                      padding: 2,
                    }}
                  >
                    <img src={qrImageUrl} alt="QR Code" style={{ width: '100%', height: '100%', pointerEvents: 'none' }} draggable={false} />
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button
              onClick={handleStamp}
              disabled={saving || !pdfDoc || !qrImageUrl}
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
