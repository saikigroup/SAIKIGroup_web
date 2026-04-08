'use client';

import { useState, useEffect, useRef } from 'react';
import type { SaikiwebDocument } from '@/lib/supabase';
import { SERVICE_BRANDS, DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from '@/lib/finance';
import QRCodeLib from 'qrcode';

interface Props {
  document: SaikiwebDocument;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStamp: () => void;
  onRefresh: (doc: SaikiwebDocument) => void;
}

export default function DocumentDetailModal({ document: doc, onClose, onEdit, onDelete, onStamp, onRefresh }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/document?token=${doc.saikiweb_verification_token}`;

  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCodeLib.toCanvas(qrCanvasRef.current, verifyUrl, {
        width: 200,
        margin: 2,
        color: { dark: '#1a1a1a', light: '#ffffff' },
      }).catch(() => {});
    }
    QRCodeLib.toDataURL(verifyUrl, { width: 400, margin: 2, color: { dark: '#1a1a1a', light: '#ffffff' } })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [verifyUrl]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/documents?id=${doc.saikiweb_document_id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) onDelete();
    } catch {
      alert('Failed to delete');
    }
    setDeleting(false);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-${doc.saikiweb_document_number.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.click();
  };

  const brand = SERVICE_BRANDS[doc.saikiweb_service_brand];
  const st = DOCUMENT_STATUS_LABELS[doc.saikiweb_status] || DOCUMENT_STATUS_LABELS.active;
  const stampHistory = doc.saikiweb_stamp_history || [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">Document Detail</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Brand header */}
          <div className="rounded-xl p-4" style={{ backgroundColor: brand.bgColor }}>
            <div className="flex items-center gap-3">
              <img src={brand.logo} alt={brand.label} className="h-5" />
              <span className="text-sm font-semibold" style={{ color: brand.color }}>{brand.label}</span>
            </div>
          </div>

          {/* Document Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Document Number</p>
              <p className="font-mono font-semibold text-gray-900">{doc.saikiweb_document_number}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Document Date</p>
              <p className="text-gray-900">{formatDate(doc.saikiweb_document_date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Document Name</p>
              <p className="font-medium text-gray-900">{doc.saikiweb_document_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Document Type</p>
              <p className="text-gray-900">{DOCUMENT_TYPE_LABELS[doc.saikiweb_document_type]}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Issued To</p>
              <p className="text-gray-900">{doc.saikiweb_issued_to}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Issued By</p>
              <p className="text-gray-900">{doc.saikiweb_issued_by}</p>
            </div>
            {doc.saikiweb_signer_name && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Signer</p>
                <p className="text-gray-900">{doc.saikiweb_signer_name}</p>
                {doc.saikiweb_signer_title && <p className="text-xs text-gray-500">{doc.saikiweb_signer_title}</p>}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>{st.label}</span>
            </div>
            {doc.saikiweb_valid_until && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Valid Until</p>
                <p className="text-gray-900">{formatDate(doc.saikiweb_valid_until)}</p>
              </div>
            )}
          </div>

          {doc.saikiweb_description && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{doc.saikiweb_description}</p>
            </div>
          )}

          {/* QR Code Section */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Verification QR Code</h3>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <canvas ref={qrCanvasRef} className="rounded" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Verification URL</p>
                  <p className="text-xs font-mono text-gray-600 bg-gray-50 rounded-lg px-3 py-2 break-all">{verifyUrl}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={downloadQR} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download QR
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(verifyUrl)} className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    Copy URL
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PDF & Stamp Section */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">PDF Document & QR Stamp</h3>
            <div className="space-y-3">
              {doc.saikiweb_original_file_url ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-sm text-gray-700 flex-1">Original PDF</span>
                  <a href={doc.saikiweb_original_file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-800 font-medium">View</a>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No PDF file uploaded. Upload a PDF when editing to enable QR stamp.</p>
              )}

              {doc.saikiweb_stamped_file_url && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm text-green-700 flex-1">Stamped PDF (with QR Code)</span>
                  <a href={doc.saikiweb_stamped_file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:text-green-900 font-medium">Download</a>
                </div>
              )}

              {doc.saikiweb_original_file_url && (
                <button
                  onClick={onStamp}
                  className="w-full py-2.5 border-2 border-dashed border-teal-300 text-teal-700 text-sm font-medium rounded-xl hover:bg-teal-50 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  {doc.saikiweb_stamped_file_url ? 'Re-stamp QR Code on PDF' : 'Stamp QR Code on PDF'}
                </button>
              )}
            </div>
          </div>

          {/* Stamp History */}
          {stampHistory.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Stamp History</h3>
              <div className="space-y-2">
                {stampHistory.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-teal-700">#{stampHistory.length - idx}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">Page {entry.page} &middot; Position ({Math.round(entry.x)}, {Math.round(entry.y)}) &middot; Size {entry.size}px</p>
                        <p className="text-xs text-gray-400">{formatDateTime(entry.stamped_at)}</p>
                      </div>
                    </div>
                    <a href={entry.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-800 font-medium shrink-0">Download</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {doc.saikiweb_notes && (
            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{doc.saikiweb_notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={onEdit} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition">Edit</button>
            <button onClick={handleDelete} disabled={deleting} className="px-6 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
