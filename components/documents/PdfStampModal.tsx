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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // PDF state
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsDocRef = useRef<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rendering, setRendering] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState('');

  // Canvas/page dimensions (display pixels)
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  // PDF page dimensions (PDF points)
  const [pdfPageWidth, setPdfPageWidth] = useState(0);
  const [pdfPageHeight, setPdfPageHeight] = useState(0);

  // QR overlay state (in display pixels)
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [qrPosition, setQrPosition] = useState({ x: 0, y: 0 });
  const [qrSize, setQrSize] = useState(80);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/document?token=${doc.saikiweb_verification_token}`;

  // Generate QR code image
  useEffect(() => {
    QRCodeLib.toDataURL(verifyUrl, { width: 400, margin: 1, color: { dark: '#1a1a1a', light: '#ffffff' } })
      .then(setQrImageUrl)
      .catch(() => {});
  }, [verifyUrl]);

  // Load PDF
  useEffect(() => {
    if (!doc.saikiweb_original_file_url) return;
    let cancelled = false;

    const loadPdf = async () => {
      try {
        // Fetch PDF bytes
        const response = await fetch(doc.saikiweb_original_file_url!);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = await response.arrayBuffer();
        if (cancelled) return;
        setPdfBytes(buffer);

        // Load with pdfjs
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const loadingTask = pdfjs.getDocument({ data: buffer.slice(0) });
        const pdfDoc = await loadingTask.promise;
        if (cancelled) return;

        pdfjsDocRef.current = pdfDoc;
        setTotalPages(pdfDoc.numPages);
        setPdfLoaded(true);
      } catch (err) {
        console.error('PDF load error:', err);
        if (!cancelled) setPdfError('Failed to load PDF file.');
      }
    };
    loadPdf();
    return () => { cancelled = true; };
  }, [doc.saikiweb_original_file_url]);

  // Render current page to canvas
  const renderPage = useCallback(async (pageNum: number) => {
    const pdfDoc = pdfjsDocRef.current;
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    setRendering(true);
    try {
      const page = await pdfDoc.getPage(pageNum);
      const containerWidth = containerRef.current.clientWidth - 4; // border
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      setCanvasWidth(viewport.width);
      setCanvasHeight(viewport.height);
      setPdfPageWidth(baseViewport.width);
      setPdfPageHeight(baseViewport.height);

      const renderContext = {
        canvasContext: ctx,
        viewport,
      };
      await (page.render(renderContext) as { promise: Promise<void> }).promise;

      // Set initial QR position (bottom-right) only on first render
      if (!initialized) {
        setQrPosition({
          x: viewport.width - qrSize - 40,
          y: viewport.height - qrSize - 40,
        });
        setInitialized(true);
      }
    } catch (err) {
      console.error('Page render error:', err);
    }
    setRendering(false);
  }, [initialized, qrSize]);

  useEffect(() => {
    if (pdfLoaded) renderPage(currentPage);
  }, [pdfLoaded, currentPage, renderPage]);

  // Handle page change
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ---- Drag handlers (display pixel coordinates) ----
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (mx >= qrPosition.x && mx <= qrPosition.x + qrSize &&
        my >= qrPosition.y && my <= qrPosition.y + qrSize) {
      setIsDragging(true);
      setDragOffset({ x: mx - qrPosition.x, y: my - qrPosition.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    setQrPosition({
      x: Math.max(0, Math.min(x, canvasWidth - qrSize)),
      y: Math.max(0, Math.min(y, canvasHeight - qrSize)),
    });
  }, [isDragging, dragOffset, canvasWidth, canvasHeight, qrSize]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch drag
  const handleTouchStart = (e: React.TouchEvent) => {
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;

    if (mx >= qrPosition.x && mx <= qrPosition.x + qrSize &&
        my >= qrPosition.y && my <= qrPosition.y + qrSize) {
      setIsDragging(true);
      setDragOffset({ x: mx - qrPosition.x, y: my - qrPosition.y });
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !overlayRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = overlayRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - dragOffset.x;
    const y = touch.clientY - rect.top - dragOffset.y;
    setQrPosition({
      x: Math.max(0, Math.min(x, canvasWidth - qrSize)),
      y: Math.max(0, Math.min(y, canvasHeight - qrSize)),
    });
  }, [isDragging, dragOffset, canvasWidth, canvasHeight, qrSize]);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleTouchMove, handleMouseUp]);

  // ---- Stamp & Save ----
  const handleStamp = async () => {
    if (!pdfBytes || !qrImageUrl || !canvasWidth || !pdfPageWidth) return;

    setSaving(true);
    setError('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDocument = await PDFDocument.load(pdfBytes);
      const page = pdfDocument.getPage(currentPage - 1);
      const { height: pageH } = page.getSize();

      // Convert display pixels -> PDF points
      const scale = pdfPageWidth / canvasWidth;
      const pdfQrX = qrPosition.x * scale;
      const pdfQrSize = qrSize * scale;
      // PDF Y is bottom-up, display Y is top-down
      const pdfQrY = pageH - (qrPosition.y * scale) - pdfQrSize;

      const qrImageBytes = await fetch(qrImageUrl).then(r => r.arrayBuffer());
      const qrImage = await pdfDocument.embedPng(qrImageBytes);

      page.drawImage(qrImage, {
        x: pdfQrX,
        y: pdfQrY,
        width: pdfQrSize,
        height: pdfQrSize,
      });

      const modifiedPdfBytes = await pdfDocument.save();

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
            <p className="text-xs text-gray-500 mt-0.5">Navigate to the page, drag QR to position, then save</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1 || rendering} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="text-sm text-gray-600 min-w-[80px] text-center">
                {pdfLoaded ? `${currentPage} / ${totalPages}` : '...'}
              </span>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages || rendering} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* QR Size */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">QR Size:</label>
              <input type="range" min={30} max={200} value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} className="w-28 accent-teal-600" />
              <span className="text-sm text-gray-500 w-12">{qrSize}px</span>
            </div>
          </div>

          {/* PDF Canvas with QR Overlay */}
          <div ref={containerRef} className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-100">
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
              <div className="relative inline-block w-full">
                <canvas ref={canvasRef} className="block w-full" />
                {rendering && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {/* Drag overlay */}
                <div
                  ref={overlayRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  className="absolute inset-0"
                  style={{ cursor: isDragging ? 'grabbing' : 'default', zIndex: 10 }}
                >
                  {qrImageUrl && canvasWidth > 0 && (
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
                  Stamping page {currentPage}...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Stamp Page {currentPage} & Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
