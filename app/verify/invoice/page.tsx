'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SERVICE_BRANDS, formatCurrency } from '@/lib/finance';
import type { ServiceBrand } from '@/lib/supabase';
import { Suspense } from 'react';

interface VerifiedInvoice {
  invoice_number: string;
  service_brand: ServiceBrand;
  status: string;
  client_name: string;
  issued_date: string;
  grand_total: number;
  currency: string;
  reference_docs: { name: string; url: string }[];
}

function InvoiceVerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<VerifiedInvoice | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No verification token provided.');
      setLoading(false);
      return;
    }

    fetch(`/api/verify/invoice?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setInvoice(data.data);
        } else {
          setError(data.error || 'Invoice not found.');
        }
      })
      .catch(() => setError('Failed to verify invoice.'))
      .finally(() => setLoading(false));
  }, [token]);

  const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: 'text-gray-700', bg: 'bg-gray-100' },
    sent: { label: 'Sent', color: 'text-blue-700', bg: 'bg-blue-100' },
    paid: { label: 'Paid', color: 'text-green-700', bg: 'bg-green-100' },
    partial: { label: 'Partially Paid', color: 'text-amber-700', bg: 'bg-amber-100' },
    overdue: { label: 'Overdue', color: 'text-red-700', bg: 'bg-red-100' },
    cancelled: { label: 'Cancelled', color: 'text-gray-500', bg: 'bg-gray-200' },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Verifying invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
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

  const brand = SERVICE_BRANDS[invoice.service_brand];
  const st = statusLabels[invoice.status] || statusLabels.draft;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6" style={{ backgroundColor: brand.headerBg }}>
          <div className="flex items-center gap-3 mb-3">
            <img src={brand.logoWhite} alt={brand.label} className="h-6 brightness-0 invert" />
          </div>
          <h1 className="text-white text-lg font-bold">Invoice Verification</h1>
        </div>

        {/* Success indicator */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-green-800 font-semibold text-sm">Verified Document</p>
              <p className="text-green-600 text-xs">This invoice is authentic and issued by {brand.label}.</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Invoice Number</span>
              <span className="font-mono font-semibold text-gray-900">{invoice.invoice_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Client</span>
              <span className="font-medium text-gray-900">{invoice.client_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Issued Date</span>
              <span className="text-gray-900">{new Date(invoice.issued_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="font-bold text-gray-900 text-lg">{formatCurrency(invoice.grand_total, invoice.currency)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>{st.label}</span>
            </div>
          </div>

          {/* Reference Documents */}
          {invoice.reference_docs && invoice.reference_docs.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Reference Documents</p>
              <div className="space-y-2">
                {invoice.reference_docs.map((doc: { name: string; url: string }, idx: number) => (
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

export default function InvoiceVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InvoiceVerificationContent />
    </Suspense>
  );
}
