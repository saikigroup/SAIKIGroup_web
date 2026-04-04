'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SERVICE_BRANDS, formatCurrency } from '@/lib/finance';
import type { ServiceBrand } from '@/lib/supabase';
import { Suspense } from 'react';

interface VerifiedReceipt {
  receipt_number: string;
  service_brand: ServiceBrand;
  client_name: string;
  amount: number;
  currency: string;
  receipt_date: string;
  payment_for: string;
  reference_docs: { name: string; url: string }[];
}

function ReceiptVerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<VerifiedReceipt | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No verification token provided.');
      setLoading(false);
      return;
    }

    fetch(`/api/verify/receipt?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setReceipt(data.data);
        } else {
          setError(data.error || 'Receipt not found.');
        }
      })
      .catch(() => setError('Failed to verify receipt.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Verifying receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !receipt) {
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

  const brand = SERVICE_BRANDS[receipt.service_brand];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6" style={{ backgroundColor: brand.headerBg }}>
          <div className="flex items-center gap-3 mb-3">
            <img src={brand.logoWhite} alt={brand.label} className="h-6 brightness-0 invert" />
          </div>
          <h1 className="text-white text-lg font-bold">Receipt Verification</h1>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-green-800 font-semibold text-sm">Verified Document</p>
              <p className="text-green-600 text-xs">This payment receipt is authentic and issued by {brand.label}.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Receipt Number</span>
              <span className="font-mono font-semibold text-gray-900">{receipt.receipt_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Received From</span>
              <span className="font-medium text-gray-900">{receipt.client_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Date</span>
              <span className="text-gray-900">{new Date(receipt.receipt_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="font-bold text-gray-900 text-lg">{formatCurrency(receipt.amount, receipt.currency)}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500 shrink-0 mr-4">Payment For</span>
              <span className="text-gray-900 text-right text-sm">{receipt.payment_for}</span>
            </div>
          </div>

          {/* Reference Documents */}
          {receipt.reference_docs && receipt.reference_docs.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Reference Documents</p>
              <div className="space-y-2">
                {receipt.reference_docs.map((doc: { name: string; url: string }, idx: number) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-700 flex-1 truncate">{doc.name}</span>
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Verified by SAIKI Group verification system.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ReceiptVerificationContent />
    </Suspense>
  );
}
