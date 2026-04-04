'use client';

import { SERVICE_BRANDS } from '@/lib/finance';
import type { ServiceBrand } from '@/lib/supabase';
import QRCode from './QRCode';
import { SaikiLogoMark, SaikiLogoMarkWhite } from './SaikiLogo';
import AutoFitSignature from './AutoFitSignature';

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
      className="mx-auto shadow-lg flex flex-col overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif", width: '794px', minHeight: '1123px', backgroundColor: brand.color }}
    >
      {/* Outer colored frame with white card */}
      <div className="flex-1 flex flex-col m-[18px]">
        <div className="bg-white rounded-md flex-1 flex flex-col relative overflow-hidden">
          {/* Background pattern */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 760 1087" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="760" cy="0" r="250" fill="none" stroke={brand.color} strokeOpacity="0.025" strokeWidth="1" />
            <circle cx="760" cy="0" r="310" fill="none" stroke={brand.color} strokeOpacity="0.02" strokeWidth="0.8" />
            <circle cx="0" cy="1087" r="180" fill="none" stroke={brand.color} strokeOpacity="0.025" strokeWidth="1" />
            <circle cx="0" cy="1087" r="240" fill="none" stroke={brand.color} strokeOpacity="0.02" strokeWidth="0.8" />
            {Array.from({ length: 25 }).map((_, i) => (
              <line key={i} x1={i * 55 - 100} y1="0" x2={i * 55 + 250} y2="1087" stroke={brand.color} strokeOpacity="0.01" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <text key={i} x={130 + i * 180} y={250 + i * 230} fontFamily="Arial" fontSize="9" fill={brand.color} fillOpacity="0.018" textAnchor="middle" transform={`rotate(-38 ${130 + i * 180} ${250 + i * 230})`}>SAIKI GROUP · OFFICIAL DOCUMENT</text>
            ))}
          </svg>

          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[5px] z-10 rounded-l-md" style={{ background: `linear-gradient(to bottom, ${brand.color}, ${brand.color}80, ${brand.color}30)` }} />

          {/* Top accent */}
          <div className="relative z-10 h-[3px] flex">
            <div className="flex-1" style={{ backgroundColor: brand.color, opacity: 0.4 }} />
            <div className="w-[35%]" style={{ backgroundColor: brand.color }} />
          </div>

          {/* ===== HEADER ===== */}
          <div className="relative z-10 pl-8 pr-8 pt-7 pb-4">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <SaikiLogoMark size={16} />
                <div className="h-3.5 w-[1px]" style={{ backgroundColor: `${brand.color}25` }} />
                <span className="text-[9px] font-bold tracking-[0.12em]" style={{ color: brand.color }}>{brand.label}</span>
              </div>
              <span className="text-[8px] text-gray-300 tracking-wider">SAIKI GROUP</span>
            </div>
            <h1 className="text-gray-900 font-bold tracking-[0.14em]" style={{ fontFamily: "'Georgia', serif", fontSize: '24px', lineHeight: 1 }}>
              PAYMENT &nbsp; RECEIPT
            </h1>
            <div className="mt-2 h-[2.5px] w-[70px] rounded-full" style={{ backgroundColor: brand.color }} />
          </div>

          {/* ===== FIELDS ===== */}
          <div className="relative z-10 pl-8 pr-8 pb-2 flex-1">
            <div className="space-y-[11px]">
              {fields.map((field, idx) => (
                <div key={idx} className="flex">
                  <span className="text-gray-400 text-[10px] font-medium min-w-[120px] shrink-0">{field.label}</span>
                  <span className="text-gray-900 text-[11px] font-medium leading-snug">{field.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== FOOTER ===== */}
          <div className="relative z-10 pl-8 pr-8 pb-7 mt-auto">
            <div className="h-[2px] mb-6 rounded-full" style={{ background: `linear-gradient(to right, ${brand.color}40, transparent)` }} />

            {/* Signature */}
            <div className="flex items-start justify-between gap-6 mb-5">
              <div />
              <div className="text-right min-w-[160px]">
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-0.5">Received By</p>
                <p className="text-[9px] font-semibold tracking-wider" style={{ color: brand.color }}>SAIKI GROUP</p>
                {signerName ? (
                  <div className="mt-1.5">
                    <div className="pb-0.5 border-b flex justify-end" style={{ borderColor: `${brand.color}30` }}>
                      <AutoFitSignature name={signerName} maxWidth={155} />
                    </div>
                    <p className="text-[9px] text-gray-600 font-medium mt-0.5">{signerName}</p>
                    {signerTitle && <p className="text-[8px] text-gray-400">{signerTitle}</p>}
                  </div>
                ) : (
                  <div className="w-36 h-10 border-b mt-2" style={{ borderColor: `${brand.color}30` }} />
                )}
              </div>
            </div>

            {/* QR + accent */}
            <div className="flex items-end justify-between gap-4">
              {verificationToken && (
                <div className="flex items-end gap-3">
                  <QRCode value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/receipt?token=${verificationToken}`} size={64} />
                  <div className="pb-0.5">
                    <p className="text-[7px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Scan to verify</p>
                    <p className="text-[6px] text-gray-300 font-mono max-w-[110px] break-all leading-snug">{verificationToken.slice(0, 16)}...</p>
                  </div>
                </div>
              )}
              <div className="flex items-end gap-[2px]">
                {[0.12, 0.2, 0.35, 0.55, 0.8].map((op, i) => (
                  <div key={i} style={{ width: '3px', height: `${7 + i * 5}px`, backgroundColor: brand.color, opacity: op, borderRadius: '1.5px 1.5px 0 0' }} />
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="mt-3 pt-2 border-t border-gray-100">
              <p className="text-[6.5px] text-gray-400 leading-relaxed">
                This document is electronically generated by SAIKI Group&apos;s authorized billing system and is valid without a wet ink signature. To verify the authenticity of this document, scan the QR code or visit the verification URL. Unauthorized reproduction or alteration of this document is strictly prohibited and may be subject to legal action under applicable Indonesian law.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
