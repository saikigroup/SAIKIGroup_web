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
  const docId = `DOC-${receiptNumber.replace(/[^A-Za-z0-9]/g, '')}`;

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

  const patternSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><text x='150' y='150' font-family='Arial' font-size='9' fill='%23ffffff' fill-opacity='0.02' text-anchor='middle' dominant-baseline='middle' transform='rotate(-40 150 150)'>SAIKI GROUP OFFICIAL DOCUMENT</text></svg>`;

  return (
    <div
      className="mx-auto shadow-lg flex flex-col relative overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif",
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: brand.color,
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`,
        backgroundSize: '300px 300px',
      }}
    >
      {/* Outer colored frame with inner white card */}
      <div className="flex-1 flex flex-col m-5">
        <div className="bg-white rounded-md flex-1 flex flex-col relative overflow-hidden">

          {/* Inner watermark */}
          {(() => {
            const innerPattern = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><text x='150' y='150' font-family='Arial' font-size='9' fill='${brand.color}' fill-opacity='0.02' text-anchor='middle' dominant-baseline='middle' transform='rotate(-40 150 150)'>SAIKI GROUP OFFICIAL DOCUMENT</text></svg>`;
            return (
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(innerPattern)}")`, backgroundSize: '300px 300px' }}
              />
            );
          })()}

          {/* ===== HEADER ===== */}
          <div className="relative z-10">
            {/* Top color band */}
            <div className="h-[4px] flex">
              <div className="flex-1" style={{ backgroundColor: brand.color, opacity: 0.6 }} />
              <div className="w-[40%]" style={{ backgroundColor: brand.color }} />
            </div>

            {/* Logo row */}
            <div className="px-10 pt-8 pb-2 flex items-start justify-between">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brand.logo} alt={brand.label} className="h-7" />
              </div>
              <span className="text-[9px] text-gray-300 font-mono">{docId}</span>
            </div>

            {/* Title + SAIKI Group sub-header */}
            <div className="px-10 pb-6">
              <h1
                className="text-gray-900 font-bold tracking-[0.18em] mb-2"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '28px', lineHeight: 1 }}
              >
                PAYMENT &nbsp; RECEIPT
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-[60px]" style={{ backgroundColor: brand.color }} />
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/saiki-main-logo-01.svg" alt="SAIKI Group" className="h-5" />
                  <span className="text-[9px] text-gray-400 tracking-[0.15em] uppercase font-medium">SAIKI Group</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== FIELDS ===== */}
          <div className="relative z-10 px-10 pb-4 flex-1">
            <div className="space-y-[14px]">
              {fields.map((field, idx) => (
                <div key={idx} className="flex">
                  <span className="text-gray-400 text-[12px] font-medium min-w-[140px] shrink-0 pt-[1px]">
                    {field.label}
                  </span>
                  <span className="text-gray-900 text-[13px] font-medium leading-snug">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== FOOTER (always at bottom of card) ===== */}
          <div className="relative z-10 px-10 pb-8 mt-auto">
            {/* Separator */}
            <div className="h-[2px] mb-8" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}30, transparent)` }} />

            {/* Signature */}
            <div className="flex items-start justify-between gap-8 mb-8">
              {/* Stamp area placeholder */}
              <div className="w-20 h-20" />

              {/* Signature */}
              <div className="text-right min-w-[200px]">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">Received By</p>
                <p className="text-[11px] font-semibold tracking-wider" style={{ color: brand.color }}>SAIKI GROUP</p>
                {signerName ? (
                  <div className="mt-3 pb-1 border-b" style={{ borderColor: `${brand.color}30` }}>
                    <span style={{ fontFamily: "'Bastliga One', cursive", fontSize: '24px', color: '#1a1a2e' }}>{signerName}</span>
                  </div>
                ) : (
                  <div className="w-48 h-14 border-b mt-3" style={{ borderColor: `${brand.color}30` }} />
                )}
              </div>
            </div>

            {/* QR + Legal */}
            <div className="flex items-end justify-between gap-6">
              {verificationToken && (
                <div className="flex items-end gap-4">
                  <QRCode
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/receipt?token=${verificationToken}`}
                    size={80}
                  />
                  <div className="pb-1">
                    <p className="text-[8px] text-gray-400 font-medium uppercase tracking-wider mb-1">Scan to verify</p>
                    <p className="text-[8px] text-gray-300 font-mono max-w-[140px] break-all leading-snug">{verificationToken.slice(0, 16)}...</p>
                  </div>
                </div>
              )}

              {/* Accent bars */}
              <div className="flex items-end gap-[2px]">
                {[0.2, 0.35, 0.5, 0.7, 0.9].map((opacity, i) => (
                  <div
                    key={i}
                    style={{ width: '3px', height: `${10 + i * 6}px`, backgroundColor: brand.color, opacity, borderRadius: '1.5px 1.5px 0 0' }}
                  />
                ))}
              </div>
            </div>

            {/* Legal text */}
            <div className="mt-5 pt-3 border-t border-gray-100">
              <p className="text-[8px] text-gray-400 leading-relaxed max-w-[85%]">
                This document is electronically generated by SAIKI Group&apos;s authorized billing system and is valid without a wet ink signature.
                To verify the authenticity of this document, scan the QR code above or visit the verification URL.
                Unauthorized reproduction or alteration of this document is strictly prohibited and may be subject to legal action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
