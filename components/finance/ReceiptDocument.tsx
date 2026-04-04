'use client';

import { SERVICE_BRANDS } from '@/lib/finance';
import type { ServiceBrand } from '@/lib/supabase';
import QRCode from './QRCode';
import { SaikiLogoMark } from './SaikiLogo';

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
  signerTitle?: string;
}

/** Abstract pattern for receipt (inside white card) */
function ReceiptPattern({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 800 1100">
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`d${i}`} x1={-100 + i * 80} y1={0} x2={-100 + i * 80 + 400} y2={1100} stroke={color} strokeOpacity={0.02} strokeWidth="0.5" />
      ))}
      {[100, 160, 220, 280].map((r, i) => (
        <circle key={`c${i}`} cx={800} cy={0} r={r} fill="none" stroke={color} strokeOpacity={0.025} strokeWidth="0.5" />
      ))}
      {[80, 140, 200].map((r, i) => (
        <circle key={`b${i}`} cx={0} cy={1100} r={r} fill="none" stroke={color} strokeOpacity={0.025} strokeWidth="0.5" />
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <text key={`w${i}`} x={150 + i * 250} y={350 + i * 300} fontFamily="Arial" fontSize="10" fill={color} fillOpacity={0.02} textAnchor="middle" transform={`rotate(-40 ${150 + i * 250} ${350 + i * 300})`}>
          SAIKI GROUP OFFICIAL DOCUMENT
        </text>
      ))}
    </svg>
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
  signerTitle,
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
        height: '297mm',
        backgroundColor: brand.color,
      }}
    >
      {/* Outer frame with inner white card */}
      <div className="flex-1 flex flex-col m-4">
        <div className="bg-white rounded-md flex-1 flex flex-col relative overflow-hidden">
          <ReceiptPattern color={brand.color} />

          {/* Top accent bar */}
          <div className="relative z-10 h-[3px] flex">
            <div className="flex-1" style={{ backgroundColor: brand.color, opacity: 0.5 }} />
            <div className="w-[35%]" style={{ backgroundColor: brand.color }} />
          </div>

          {/* Header */}
          <div className="relative z-10 px-10 pt-8 pb-4">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <SaikiLogoMark size={18} />
                <div className="h-4 w-[1px]" style={{ backgroundColor: `${brand.color}25` }} />
                <span className="text-[10px] font-bold tracking-[0.15em]" style={{ color: brand.color }}>{brand.label}</span>
              </div>
            </div>

            <h1 className="text-gray-900 font-bold tracking-[0.15em]" style={{ fontFamily: "'Georgia', serif", fontSize: '26px', lineHeight: 1 }}>
              PAYMENT &nbsp; RECEIPT
            </h1>
            <div className="mt-2 h-[2px] w-[80px]" style={{ backgroundColor: brand.color }} />
          </div>

          {/* Fields */}
          <div className="relative z-10 px-10 pb-2 flex-1">
            <div className="space-y-[12px]">
              {fields.map((field, idx) => (
                <div key={idx} className="flex">
                  <span className="text-gray-400 text-[11px] font-medium min-w-[130px] shrink-0">{field.label}</span>
                  <span className="text-gray-900 text-[12px] font-medium leading-snug">{field.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 px-10 pb-8 mt-auto">
            <div className="h-[1px] mb-6" style={{ background: `linear-gradient(to right, ${brand.color}30, transparent)` }} />

            {/* Signature */}
            <div className="flex items-start justify-between gap-6 mb-6">
              <div />
              <div className="text-right min-w-[170px]">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-0.5">Received By</p>
                <p className="text-[10px] font-semibold tracking-wider" style={{ color: brand.color }}>SAIKI GROUP</p>
                {signerName ? (
                  <div className="mt-2">
                    <div className="pb-1 border-b" style={{ borderColor: `${brand.color}30` }}>
                      <span style={{ fontFamily: "'Bastliga One', cursive", fontSize: '22px', color: '#1a1a2e' }}>{signerName}</span>
                    </div>
                    <p className="text-[10px] text-gray-600 font-medium mt-1">{signerName}</p>
                    {signerTitle && <p className="text-[9px] text-gray-400">{signerTitle}</p>}
                  </div>
                ) : (
                  <div className="w-40 h-12 border-b mt-2" style={{ borderColor: `${brand.color}30` }} />
                )}
              </div>
            </div>

            {/* QR + accent */}
            <div className="flex items-end justify-between gap-4">
              {verificationToken && (
                <div className="flex items-end gap-3">
                  <QRCode
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/receipt?token=${verificationToken}`}
                    size={68}
                  />
                  <div className="pb-0.5">
                    <p className="text-[7px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Scan to verify</p>
                    <p className="text-[7px] text-gray-300 font-mono leading-snug max-w-[120px] break-all">{verificationToken.slice(0, 16)}...</p>
                  </div>
                </div>
              )}
              <div className="flex items-end gap-[2px]">
                {[0.15, 0.25, 0.4, 0.6, 0.8].map((op, i) => (
                  <div key={i} style={{ width: '3px', height: `${8 + i * 5}px`, backgroundColor: brand.color, opacity: op, borderRadius: '1.5px 1.5px 0 0' }} />
                ))}
              </div>
            </div>

            {/* Legal text */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[7px] text-gray-400 leading-relaxed">
                This document is electronically generated by SAIKI Group&apos;s authorized billing system and is valid without a wet ink signature.
                To verify the authenticity of this document, scan the QR code or visit the verification URL.
                Unauthorized reproduction or alteration of this document is strictly prohibited and may be subject to legal action under applicable Indonesian law.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
