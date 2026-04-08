'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SERVICE_BRANDS, DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from '@/lib/finance';
import type { ServiceBrand, DocumentType, DocumentStatus } from '@/lib/supabase';
import { Suspense } from 'react';

interface VerifiedDocument {
  document_number: string;
  document_name: string;
  document_type: DocumentType;
  document_date: string;
  service_brand: ServiceBrand;
  status: DocumentStatus;
  issued_to: string;
  issued_by: string;
  description?: string;
  signer_name?: string;
  signer_title?: string;
  valid_until?: string;
}

function DocumentVerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState<VerifiedDocument | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No verification token provided.');
      setLoading(false);
      return;
    }

    fetch(`/api/verify/document?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setDoc(data.data);
        } else {
          setError(data.error || 'Document not found.');
        }
      })
      .catch(() => setError('Failed to verify document.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Verifying document...</p>
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h1>
          <p className="text-gray-500">{error}</p>
          <p className="text-sm text-gray-400 mt-4">If you believe this is an error, please contact SAIKI Group.</p>
        </div>
      </div>
    );
  }

  const brand = SERVICE_BRANDS[doc.service_brand];
  const st = DOCUMENT_STATUS_LABELS[doc.status] || DOCUMENT_STATUS_LABELS.active;
  const isActive = doc.status === 'active';
  const isExpired = doc.valid_until && new Date(doc.valid_until) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Brand Header */}
        <div className="px-8 py-6" style={{ backgroundColor: brand.headerBg }}>
          <div className="flex items-center gap-3 mb-3">
            <img src={brand.logoWhite} alt={brand.label} className="h-6 brightness-0 invert" />
          </div>
          <h1 className="text-white text-lg font-bold">Document Verification</h1>
        </div>

        <div className="px-8 py-6">
          {/* Verification Status */}
          {isActive && !isExpired ? (
            <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-semibold text-sm">Verified Document</p>
                <p className="text-green-600 text-xs">This document is authentic and issued by {brand.label}.</p>
              </div>
            </div>
          ) : doc.status === 'revoked' ? (
            <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 rounded-xl">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-red-800 font-semibold text-sm">Document Revoked</p>
                <p className="text-red-600 text-xs">This document has been revoked and is no longer valid.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-amber-800 font-semibold text-sm">Document Expired</p>
                <p className="text-amber-600 text-xs">This document was authentic but has expired.</p>
              </div>
            </div>
          )}

          {/* Document Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Document Number</span>
              <span className="font-mono font-semibold text-gray-900 text-right">{doc.document_number}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Document Name</span>
              <span className="font-medium text-gray-900 text-right max-w-[60%]">{doc.document_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Document Type</span>
              <span className="text-gray-900">{DOCUMENT_TYPE_LABELS[doc.document_type]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Document Date</span>
              <span className="text-gray-900">{new Date(doc.document_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Issued To</span>
              <span className="font-medium text-gray-900 text-right">{doc.issued_to}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500">Issued By</span>
              <span className="text-gray-900 text-right">{doc.issued_by}</span>
            </div>
            {doc.signer_name && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500">Signer</span>
                <div className="text-right">
                  <span className="text-gray-900">{doc.signer_name}</span>
                  {doc.signer_title && <p className="text-xs text-gray-500">{doc.signer_title}</p>}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>{st.label}</span>
            </div>
            {doc.valid_until && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Valid Until</span>
                <span className={`text-gray-900 ${isExpired ? 'text-red-600 line-through' : ''}`}>
                  {new Date(doc.valid_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>

          {doc.description && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{doc.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Verified by SAIKI Group document verification system.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DocumentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DocumentVerificationContent />
    </Suspense>
  );
}
