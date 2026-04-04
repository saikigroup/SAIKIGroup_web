'use client';

import { useState, useRef } from 'react';
import { formatCurrency } from '@/lib/finance';
import { downloadElementAsPDF } from '@/lib/pdf';
import type { SaikiwebReceipt } from '@/lib/supabase';
import ReceiptDocument from './ReceiptDocument';

interface ReceiptDetailModalProps {
  receipt: SaikiwebReceipt;
  onClose: () => void;
  onEdit: () => void;
  onSendEmail: () => void;
}

const STAMP_THRESHOLD = 5000000; // 5 juta IDR

export default function ReceiptDetailModal({ receipt, onClose, onEdit, onSendEmail }: ReceiptDetailModalProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [stampStatus, setStampStatus] = useState(receipt.saikiweb_stamp_status || 'not_required');
  const [stampedFileUrl, setStampedFileUrl] = useState(receipt.saikiweb_stamped_file_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const needsStamp = receipt.saikiweb_currency === 'IDR' && receipt.saikiweb_amount >= STAMP_THRESHOLD;
  const isStamped = stampStatus === 'stamped';
  const canSendEmail = !needsStamp || isStamped;

  const verifyUrl = receipt.saikiweb_verification_token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/receipt?token=${receipt.saikiweb_verification_token}`
    : null;

  const copyVerifyUrl = () => {
    if (verifyUrl) {
      navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUploadStamp = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('receipt_id', String(receipt.saikiweb_receipt_id));
      formData.append('document_type', 'receipt');

      const res = await fetch('/api/admin/receipts/upload-stamp', {
        method: 'POST',
        headers: { 'x-admin-password': pw },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStampStatus('stamped');
        setStampedFileUrl(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    }
    setUploading(false);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (showPreview) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-black/60" onClick={() => setShowPreview(false)} />
        <div className="relative my-8 w-full max-w-[210mm]">
          <div className="absolute -top-2 -right-2 z-10 flex items-center gap-2">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!previewRef.current) { console.error('previewRef not attached'); return; }
                setDownloading(true);
                try {
                  await downloadElementAsPDF(previewRef.current, `${receipt.saikiweb_receipt_number}.pdf`);
                } catch (err) { console.error('PDF download failed:', err); alert('Failed to generate PDF. Please try again.'); }
                setDownloading(false);
              }}
              disabled={downloading}
              className="bg-teal-600 text-white rounded-full p-2.5 shadow-lg hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
              title="Download PDF"
              type="button"
            >
              {downloading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              )}
            </button>
            <button onClick={() => setShowPreview(false)} className="bg-white rounded-full p-2 shadow-lg text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div ref={previewRef}>
          <ReceiptDocument
            receiptNumber={receipt.saikiweb_receipt_number}
            serviceBrand={receipt.saikiweb_service_brand}
            clientName={receipt.saikiweb_client_name}
            clientAddress={receipt.saikiweb_client_address}
            amount={receipt.saikiweb_amount}
            amountWords={receipt.saikiweb_amount_words}
            currency={receipt.saikiweb_currency}
            paymentFor={receipt.saikiweb_payment_for}
            packageValue={receipt.saikiweb_package_value || undefined}
            reference={receipt.saikiweb_reference || undefined}
            paymentMethod={receipt.saikiweb_payment_method}
            receiptDate={receipt.saikiweb_receipt_date}
            customFields={receipt.saikiweb_custom_fields || undefined}
            verificationToken={receipt.saikiweb_verification_token || undefined}
            signerName={receipt.saikiweb_signer_name || undefined}
          />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">Receipt Detail</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Receipt #</p>
              <p className="font-mono font-medium text-gray-900">{receipt.saikiweb_receipt_number}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="text-gray-900">{formatDate(receipt.saikiweb_receipt_date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Client</p>
              <p className="font-medium text-gray-900">{receipt.saikiweb_client_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Amount</p>
              <p className="font-bold text-gray-900">{formatCurrency(receipt.saikiweb_amount, receipt.saikiweb_currency)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Payment For</p>
            <p className="text-sm text-gray-800">{receipt.saikiweb_payment_for}</p>
          </div>

          {/* E-Meterai Status Section */}
          {needsStamp && (
            <div className={`rounded-xl p-4 ${isStamped ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                {isStamped ? (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                  </div>
                )}
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isStamped ? 'text-green-800' : 'text-amber-800'}`}>
                    {isStamped ? 'E-Meterai Applied' : 'E-Meterai Required'}
                  </p>
                  <p className={`text-xs ${isStamped ? 'text-green-600' : 'text-amber-600'}`}>
                    {isStamped
                      ? 'Stamped document has been uploaded and is ready to send.'
                      : `Receipt amount ${formatCurrency(receipt.saikiweb_amount, receipt.saikiweb_currency)} requires e-meterai (>= Rp5,000,000). Upload the stamped PDF to proceed.`
                    }
                  </p>
                </div>
              </div>

              {isStamped && stampedFileUrl ? (
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={stampedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200 transition font-medium"
                  >
                    View Stamped PDF
                  </a>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Replace File
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-2 w-full py-2.5 border-2 border-dashed border-amber-300 text-amber-700 text-sm font-medium rounded-xl hover:bg-amber-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      Upload Stamped PDF
                    </>
                  )}
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleUploadStamp}
                className="hidden"
              />
            </div>
          )}

          {verifyUrl && (
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600 font-medium mb-1">Verification URL</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded flex-1 truncate">{verifyUrl}</code>
                <button onClick={copyVerifyUrl} className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {receipt.saikiweb_sent_at && (
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-green-600 font-medium">Email sent on {formatDate(receipt.saikiweb_sent_at)}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <button onClick={() => setShowPreview(true)} className="py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition">Preview</button>
            <button
              onClick={onSendEmail}
              disabled={!canSendEmail}
              className={`py-2.5 text-sm font-medium rounded-xl transition ${
                canSendEmail
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title={!canSendEmail ? 'Upload stamped document first' : ''}
            >
              Send Email
            </button>
            <button onClick={onEdit} className="py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition">Edit</button>
            <button onClick={onClose} className="py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
