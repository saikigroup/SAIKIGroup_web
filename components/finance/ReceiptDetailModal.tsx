'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/finance';
import type { SaikiwebReceipt } from '@/lib/supabase';
import ReceiptDocument from './ReceiptDocument';

interface ReceiptDetailModalProps {
  receipt: SaikiwebReceipt;
  onClose: () => void;
  onEdit: () => void;
}

export default function ReceiptDetailModal({ receipt, onClose, onEdit }: ReceiptDetailModalProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (showPreview) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-black/60" onClick={() => setShowPreview(false)} />
        <div className="relative my-8 w-full max-w-[210mm]">
          <button onClick={() => setShowPreview(false)} className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-2 shadow-lg text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
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
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full">
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

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button onClick={() => setShowPreview(true)} className="py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition">Preview</button>
            <button onClick={onEdit} className="py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition">Edit</button>
            <button onClick={onClose} className="py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
