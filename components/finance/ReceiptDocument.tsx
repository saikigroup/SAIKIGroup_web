'use client';

import { SERVICE_BRANDS, formatCurrency } from '@/lib/finance';
import type { ServiceBrand } from '@/lib/supabase';
import QRCode from './QRCode';

interface ReceiptDocumentProps {
  receiptNumber: string;
  serviceBrand: ServiceBrand;
  clientName: string;
  clientAddress: string;
  amount: number;
  amountWords: string;
  currency?: string;
  paymentFor: string;
  packageValue?: number;
  reference?: string;
  paymentMethod: string;
  receiptDate: string;
  customFields?: Record<string, string>;
  verificationToken?: string;
  signerName?: string;
}

export default function ReceiptDocument({
  receiptNumber,
  serviceBrand,
  clientName,
  clientAddress,
  amount,
  amountWords,
  currency = 'IDR',
  paymentFor,
  packageValue,
  reference,
  paymentMethod,
  receiptDate,
  customFields,
  verificationToken,
  signerName,
}: ReceiptDocumentProps) {
  const brand = SERVICE_BRANDS[serviceBrand];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const fields = [
    { label: 'Receipt No.', value: receiptNumber },
    { label: 'Date', value: formatDate(receiptDate) },
    { label: 'Received From', value: clientName },
    { label: 'Address', value: clientAddress },
    { label: 'Amount', value: `${currency} ${amount.toLocaleString('id-ID')}` },
    { label: 'Amount in Words', value: amountWords },
    { label: 'Payment For', value: paymentFor },
    ...(packageValue ? [{ label: 'Package Value', value: `${currency} ${packageValue.toLocaleString('id-ID')}` }] : []),
    ...(reference ? [{ label: 'Reference', value: reference }] : []),
    { label: 'Payment Method', value: paymentMethod },
    ...(customFields ? Object.entries(customFields).map(([key, value]) => ({ label: key, value })) : []),
  ];

  return (
    <div
      className="w-full max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: 'Arial, sans-serif', backgroundColor: brand.color }}
    >
      <div className="p-8">
        {/* Inner white card */}
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-6">
              <img src={brand.logo} alt={brand.label} className="h-7" />
            </div>

            <h1 className="text-3xl font-bold tracking-wider text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              PAYMENT &nbsp; RECEIPT
            </h1>
          </div>

          {/* Fields */}
          <div className="px-8 pb-8">
            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div key={idx} className="flex gap-6">
                  <span className="text-gray-600 text-sm font-medium min-w-[130px] shrink-0">
                    {field.label}
                  </span>
                  <span className="text-gray-900 text-sm font-medium">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature & QR Code */}
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between">
              {verificationToken && (
                <QRCode value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/receipt?token=${verificationToken}`} size={64} />
              )}
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Received By:</p>
                {signerName ? (
                  <div>
                    <span style={{ fontFamily: "'Bastliga One', cursive", fontSize: '28px', color: '#1a1a2e' }}>{signerName}</span>
                  </div>
                ) : (
                  <div className="w-40 h-16 border-b border-gray-300" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
