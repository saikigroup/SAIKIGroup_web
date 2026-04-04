'use client';

import { SERVICE_BRANDS } from '@/lib/finance';
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

/* SVG anti-forgery watermark */
function WatermarkPattern({ color }: { color: string }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><text x="50%" y="50%" font-family="Arial" font-size="10" fill="${color}" fill-opacity="0.04" text-anchor="middle" dominant-baseline="middle" transform="rotate(-35 100 100)">SAIKI GROUP</text></svg>`;
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, backgroundSize: '200px 200px' }}
    />
  );
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
      className="mx-auto shadow-lg flex flex-col"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif",
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: brand.color,
      }}
    >
      {/* Outer colored border with inner white card */}
      <div className="flex-1 flex flex-col m-6">
        <div className="bg-white rounded-lg flex-1 flex flex-col relative overflow-hidden">
          <WatermarkPattern color={brand.color} />

          {/* Thin accent at top of card */}
          <div className="flex h-[4px] relative z-10">
            <div className="flex-1" style={{ backgroundColor: brand.color, opacity: 0.5 }} />
            <div className="w-[30%]" style={{ backgroundColor: brand.color }} />
          </div>

          {/* Header: Logo + Title */}
          <div className="relative z-10 px-10 pt-10 pb-6">
            <div className="flex items-start justify-between mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logo} alt={brand.label} className="h-7" />
              <p className="text-[11px] text-gray-400 font-medium tracking-wider">{brand.label}</p>
            </div>

            <h1
              className="text-gray-900 font-bold tracking-[0.18em]"
              style={{ fontFamily: "'Georgia', serif", fontSize: '30px', lineHeight: 1 }}
            >
              PAYMENT &nbsp; RECEIPT
            </h1>
            <div className="mt-3 h-[2px]" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}40, transparent)`, maxWidth: '240px' }} />
          </div>

          {/* Fields */}
          <div className="relative z-10 px-10 pb-4 flex-1">
            <div className="space-y-[16px]">
              {fields.map((field, idx) => (
                <div key={idx} className="flex">
                  <span className="text-gray-400 text-[13px] font-medium min-w-[140px] shrink-0 pt-[1px]">
                    {field.label}
                  </span>
                  <span className="text-gray-900 text-[13px] font-medium leading-snug">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature + QR - always at very bottom */}
          <div className="relative z-10 px-10 pb-10 mt-auto">
            {/* Divider */}
            <div className="h-[1px] bg-gray-100 mb-8" />

            <div className="flex items-end justify-between">
              {/* Left: stamp / materai area */}
              <div className="flex items-end gap-[2px]">
                <div style={{ width: '4px', height: '28px', backgroundColor: brand.color, opacity: 0.7, borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '4px', height: '20px', backgroundColor: brand.color, opacity: 0.4, borderRadius: '2px 2px 0 0' }} />
                <div style={{ width: '4px', height: '12px', backgroundColor: brand.color, opacity: 0.2, borderRadius: '2px 2px 0 0' }} />
              </div>

              {/* Right: Received By + signature */}
              <div className="text-right min-w-[180px]">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.15em] mb-1">Received By</p>
                <p className="text-[11px] text-gray-500 font-semibold tracking-wider">SAIKI GROUP</p>
                {signerName ? (
                  <div className="mt-2 pb-1 border-b border-gray-200">
                    <span style={{ fontFamily: "'Bastliga One', cursive", fontSize: '26px', color: '#1a1a2e' }}>{signerName}</span>
                  </div>
                ) : (
                  <div className="w-44 h-14 border-b border-gray-200 mt-3" />
                )}
              </div>
            </div>

            {/* QR at bottom right */}
            {verificationToken && (
              <div className="flex justify-end mt-5">
                <QRCode
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/receipt?token=${verificationToken}`}
                  size={52}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
