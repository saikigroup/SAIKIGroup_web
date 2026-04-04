'use client';

import { SERVICE_BRANDS, formatCurrency } from '@/lib/finance';
import type { ServiceBrand } from '@/lib/supabase';
import QRCode from './QRCode';
import { SaikiLogoMark, SaikiLogoMarkWhite } from './SaikiLogo';
import AutoFitSignature from './AutoFitSignature';

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface InvoiceDocumentProps {
  invoiceNumber: string;
  serviceBrand: ServiceBrand;
  clientName: string;
  clientAddress: string;
  issuedDate: string;
  items: InvoiceItem[];
  grandTotal: number;
  currency?: string;
  paymentBank?: string;
  paymentAccount?: string;
  paymentRecipient?: string;
  notes?: string;
  customFields?: Record<string, string>;
  verificationToken?: string;
  signerName?: string;
  signerTitle?: string;
}

export default function InvoiceDocument({
  invoiceNumber,
  serviceBrand,
  clientName,
  clientAddress,
  issuedDate,
  items,
  grandTotal,
  currency = 'IDR',
  paymentBank,
  paymentAccount,
  paymentRecipient,
  customFields,
  verificationToken,
  signerName,
  signerTitle,
}: InvoiceDocumentProps) {
  const brand = SERVICE_BRANDS[serviceBrand];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div
      className="bg-white mx-auto shadow-lg relative overflow-hidden flex flex-col"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif", width: '794px', minHeight: '1123px' }}
    >
      {/* ===== BACKGROUND: Abstract geometric pattern ===== */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Large circle arcs - top right */}
        <circle cx="794" cy="0" r="280" fill="none" stroke={brand.color} strokeOpacity="0.03" strokeWidth="1" />
        <circle cx="794" cy="0" r="340" fill="none" stroke={brand.color} strokeOpacity="0.025" strokeWidth="0.8" />
        <circle cx="794" cy="0" r="400" fill="none" stroke={brand.color} strokeOpacity="0.02" strokeWidth="0.6" />
        {/* Large circle arcs - bottom left */}
        <circle cx="0" cy="1123" r="200" fill="none" stroke={brand.color} strokeOpacity="0.03" strokeWidth="1" />
        <circle cx="0" cy="1123" r="260" fill="none" stroke={brand.color} strokeOpacity="0.025" strokeWidth="0.8" />
        {/* Diagonal fine lines */}
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={i} x1={i * 55 - 200} y1="0" x2={i * 55 + 300} y2="1123" stroke={brand.color} strokeOpacity="0.012" strokeWidth="0.5" />
        ))}
        {/* Micro-dot security grid */}
        {Array.from({ length: 12 }).map((_, r) =>
          Array.from({ length: 8 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={50 + c * 100} cy={50 + r * 95} r="0.8" fill={brand.color} fillOpacity="0.025" />
          ))
        )}
        {/* Watermark text */}
        {Array.from({ length: 5 }).map((_, i) => (
          <text key={i} x={120 + i * 160} y={200 + i * 200} fontFamily="Arial" fontSize="9" fill={brand.color} fillOpacity="0.02" textAnchor="middle" transform={`rotate(-38 ${120 + i * 160} ${200 + i * 200})`}>SAIKI GROUP · OFFICIAL DOCUMENT</text>
        ))}
      </svg>

      {/* ===== LEFT ACCENT BAR (runs full height) ===== */}
      <div className="absolute left-0 top-0 bottom-0 w-[6px] z-10" style={{ background: `linear-gradient(to bottom, ${brand.color}, ${brand.color}90, ${brand.color}40)` }} />

      {/* ===== HEADER SECTION ===== */}
      <div className="relative z-10 flex">
        {/* Main header - colored */}
        <div className="flex-1 pl-8 pr-10 py-7" style={{ backgroundColor: brand.color }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <SaikiLogoMarkWhite size={30} />
              <div>
                <p className="text-white text-[13px] font-bold tracking-wider">{brand.label.split(' ')[0]}<span className="font-normal opacity-60 ml-1">{brand.label.split(' ').slice(1).join(' ')}</span></p>
                <p className="text-white/30 text-[8px] tracking-[0.3em] uppercase">Beyond Your Needs</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-white font-bold tracking-[0.1em]" style={{ fontFamily: "'Georgia', serif", fontSize: '28px', lineHeight: 1 }}>INVOICE</h1>
              <p className="text-white/50 text-[10px] mt-1.5">No: <span className="text-white/80 font-medium">{invoiceNumber}</span></p>
              <p className="text-white/50 text-[10px]">Issued: <span className="text-white/80 font-medium">{formatDate(issuedDate)}</span></p>
            </div>
          </div>
        </div>
        {/* Geometric corner accent */}
        <div className="w-[60px] relative" style={{ backgroundColor: brand.color }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 100" preserveAspectRatio="none">
            <polygon points="0,0 60,0 60,100" fill="white" fillOpacity="0.08" />
          </svg>
        </div>
      </div>

      {/* Sub-header */}
      <div className="relative z-10 pl-8 pr-10 py-2 flex items-center gap-2" style={{ backgroundColor: `${brand.color}06`, borderBottom: `1px solid ${brand.color}0D` }}>
        <SaikiLogoMark size={12} />
        <span className="text-[8px] text-gray-400 tracking-[0.15em] uppercase font-semibold">SAIKI Group — Official Document</span>
      </div>

      {/* ===== BILLED TO ===== */}
      <div className="relative z-10 pl-8 pr-10 pt-5 pb-4">
        <p className="text-[8px] font-bold uppercase tracking-[0.3em] mb-1.5" style={{ color: brand.color }}>Billed To</p>
        <p className="font-bold text-gray-900 text-[14px] leading-tight">{clientName}</p>
        <p className="text-gray-500 text-[10px] leading-relaxed mt-1 whitespace-pre-line">{clientAddress}</p>
      </div>

      {/* ===== ITEMS TABLE ===== */}
      <div className="relative z-10 pl-8 pr-10 pb-3">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${brand.color}` }}>
              <th className="text-left text-[8px] font-bold uppercase tracking-[0.2em] pb-2 w-[30px]" style={{ color: brand.color }}>No</th>
              <th className="text-left text-[8px] font-bold uppercase tracking-[0.2em] pb-2" style={{ color: brand.color }}>Deskripsi</th>
              <th className="text-center text-[8px] font-bold uppercase tracking-[0.2em] pb-2 w-[55px]" style={{ color: brand.color }}>Jumlah</th>
              <th className="text-right text-[8px] font-bold uppercase tracking-[0.2em] pb-2 w-[100px]" style={{ color: brand.color }}>Harga</th>
              <th className="text-right text-[8px] font-bold uppercase tracking-[0.2em] pb-2 w-[100px]" style={{ color: brand.color }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td className="text-gray-400 text-[11px] py-3 align-top">{idx + 1}</td>
                <td className="text-gray-800 text-[11px] py-3 pr-4 align-top leading-relaxed">{item.description}</td>
                <td className="text-gray-600 text-[11px] py-3 text-center align-top">{item.quantity}</td>
                <td className="text-gray-600 text-[11px] py-3 text-right align-top whitespace-nowrap">{formatCurrency(item.unit_price, currency)}</td>
                <td className="text-gray-900 text-[11px] py-3 text-right align-top whitespace-nowrap font-semibold">{formatCurrency(item.subtotal, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== GRAND TOTAL BAR ===== */}
      <div className="relative z-10 pl-8 pr-10 pb-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center rounded-md overflow-hidden" style={{ border: `2px solid ${brand.color}` }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-2" style={{ color: brand.color }}>Grand Total</span>
            <span className="text-white font-bold text-[16px] px-5 py-2 tracking-wide" style={{ backgroundColor: brand.color }}>{formatCurrency(grandTotal, currency)}</span>
          </div>
        </div>
      </div>

      {/* ===== COLORED DIVIDER BAND ===== */}
      <div className="relative z-10 pl-8 pr-10">
        <div className="h-[3px] rounded-full" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}50, ${brand.color}15)` }} />
      </div>

      {/* ===== BOTTOM SECTION (flex-1 to fill) ===== */}
      <div className="relative z-10 flex-1 pl-8 pr-10 pt-4 pb-5 flex flex-col">
        {/* Payment + Signature */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: brand.color }}>Payment Information</p>
            <div className="text-gray-600 text-[11px] leading-[1.7]">
              {paymentBank && <p>Bank {paymentBank}</p>}
              {paymentAccount && <p>{paymentAccount}</p>}
              {paymentRecipient && <p>Recipient {paymentRecipient}</p>}
            </div>
          </div>
          <div className="text-right min-w-[160px]">
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-0.5">Authorized by</p>
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

        {/* Custom fields */}
        {customFields && Object.keys(customFields).length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            {Object.entries(customFields).map(([key, value]) => (
              <div key={key} className="flex gap-3 text-[10px] py-0.5">
                <span className="font-medium text-gray-400 min-w-[90px]">{key}:</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ===== FOOTER: QR + Legal (always at bottom) ===== */}
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-4">
            {verificationToken && (
              <div className="flex items-end gap-3">
                <QRCode value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/invoice?token=${verificationToken}`} size={68} />
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
          <div className="mt-3 pt-2 border-t border-gray-100">
            <p className="text-[6.5px] text-gray-400 leading-relaxed">
              This document is electronically generated by SAIKI Group&apos;s authorized billing system and is valid without a wet ink signature. To verify the authenticity of this document, scan the QR code or visit the verification URL. Unauthorized reproduction or alteration of this document is strictly prohibited and may be subject to legal action under applicable Indonesian law.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="relative z-10 h-[3px]" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}60, ${brand.color}10)` }} />
    </div>
  );
}
