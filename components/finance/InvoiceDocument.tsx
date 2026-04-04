'use client';

import { SERVICE_BRANDS, formatCurrency } from '@/lib/finance';
import type { ServiceBrand } from '@/lib/supabase';
import QRCode from './QRCode';
import { SaikiLogoMark, SaikiLogoMarkWhite } from './SaikiLogo';

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

/** Abstract geometric pattern unique to SAIKI - hard to replicate */
function BrandPattern({ color, opacity = 0.06 }: { color: string; opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 800 1131">
      {/* Diagonal mesh lines */}
      {Array.from({ length: 25 }).map((_, i) => (
        <line key={`d${i}`} x1={-100 + i * 72} y1={0} x2={-100 + i * 72 + 400} y2={1131} stroke={color} strokeOpacity={opacity * 0.4} strokeWidth="0.5" />
      ))}
      {/* Concentric arcs top-right */}
      {[120, 180, 240, 300].map((r, i) => (
        <circle key={`c${i}`} cx={800} cy={0} r={r} fill="none" stroke={color} strokeOpacity={opacity * 0.5} strokeWidth="0.5" />
      ))}
      {/* Concentric arcs bottom-left */}
      {[100, 160, 220].map((r, i) => (
        <circle key={`b${i}`} cx={0} cy={1131} r={r} fill="none" stroke={color} strokeOpacity={opacity * 0.5} strokeWidth="0.5" />
      ))}
      {/* Micro dot grid */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <circle key={`dot${row}${col}`} cx={80 + col * 130} cy={80 + row * 140} r="1" fill={color} fillOpacity={opacity * 0.3} />
        ))
      )}
      {/* Diagonal "SAIKI" watermark text */}
      {Array.from({ length: 4 }).map((_, i) => (
        <text key={`w${i}`} x={100 + i * 200} y={300 + i * 250} fontFamily="Arial" fontSize="11" fill={color} fillOpacity={opacity * 0.35} textAnchor="middle" transform={`rotate(-40 ${100 + i * 200} ${300 + i * 250})`}>
          SAIKI GROUP OFFICIAL DOCUMENT
        </text>
      ))}
    </svg>
  );
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
      className="bg-white mx-auto shadow-lg flex flex-col relative overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif",
        width: '210mm',
        height: '297mm',
      }}
    >
      {/* Background pattern */}
      <BrandPattern color={brand.color} />

      {/* ===== TOP HEADER BAND ===== */}
      <div className="relative z-10" style={{ backgroundColor: brand.color }}>
        {/* Geometric accent overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-[30%] opacity-20">
          <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="w-full h-full">
            <polygon points="60,0 200,0 200,100 0,100" fill="white" fillOpacity="0.08" />
            <polygon points="120,0 200,0 200,60" fill="white" fillOpacity="0.05" />
          </svg>
        </div>

        <div className="relative z-10 px-10 py-6 flex items-center justify-between">
          {/* Left: brand service logo mark */}
          <div className="flex items-center gap-3">
            <SaikiLogoMarkWhite size={28} />
            <div>
              <p className="text-white text-[14px] font-bold tracking-wide">{brand.label.split(' ')[0]}</p>
              <p className="text-white/50 text-[10px] tracking-[0.2em] uppercase">{brand.label.split(' ').slice(1).join(' ')}</p>
            </div>
          </div>
          {/* Right: INVOICE + number */}
          <div className="text-right">
            <h1 className="text-white font-bold tracking-[0.12em] leading-none" style={{ fontFamily: "'Georgia', serif", fontSize: '32px' }}>
              INVOICE
            </h1>
            <p className="text-white/50 text-[11px] mt-1.5">No: <span className="text-white/80 font-medium">{invoiceNumber}</span></p>
            <p className="text-white/50 text-[11px]">Issued: <span className="text-white/80 font-medium">{formatDate(issuedDate)}</span></p>
          </div>
        </div>
      </div>

      {/* ===== SUB-HEADER ===== */}
      <div className="relative z-10 px-10 py-2.5 flex items-center justify-between" style={{ backgroundColor: `${brand.color}08`, borderBottom: `1px solid ${brand.color}10` }}>
        <div className="flex items-center gap-2.5">
          <SaikiLogoMark size={14} />
          <div className="h-3 w-[1px]" style={{ backgroundColor: `${brand.color}25` }} />
          <span className="text-[9px] text-gray-400 tracking-[0.15em] uppercase font-semibold">SAIKI Group — Official Document</span>
        </div>
      </div>

      {/* ===== BILLED TO ===== */}
      <div className="relative z-10 px-10 pt-6 pb-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: brand.color }}>Billed To</p>
        <p className="font-bold text-gray-900 text-[15px] leading-tight">{clientName}</p>
        <p className="text-gray-500 text-[11px] leading-relaxed mt-1 whitespace-pre-line">{clientAddress}</p>
      </div>

      {/* ===== ITEMS TABLE ===== */}
      <div className="relative z-10 px-10 pb-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${brand.color}` }}>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] pb-2 w-[36px]" style={{ color: brand.color }}>No</th>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] pb-2" style={{ color: brand.color }}>Deskripsi</th>
              <th className="text-center text-[9px] font-bold uppercase tracking-[0.2em] pb-2 w-[60px]" style={{ color: brand.color }}>Jumlah</th>
              <th className="text-right text-[9px] font-bold uppercase tracking-[0.2em] pb-2 w-[105px]" style={{ color: brand.color }}>Harga</th>
              <th className="text-right text-[9px] font-bold uppercase tracking-[0.2em] pb-2 w-[105px]" style={{ color: brand.color }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td className="text-gray-400 text-[12px] py-3 align-top">{idx + 1}</td>
                <td className="text-gray-800 text-[12px] py-3 pr-4 align-top leading-relaxed">{item.description}</td>
                <td className="text-gray-600 text-[12px] py-3 text-center align-top">{item.quantity}</td>
                <td className="text-gray-600 text-[12px] py-3 text-right align-top whitespace-nowrap">{formatCurrency(item.unit_price, currency)}</td>
                <td className="text-gray-900 text-[12px] py-3 text-right align-top whitespace-nowrap font-semibold">{formatCurrency(item.subtotal, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Grand Total */}
        <div className="flex items-center justify-end mt-5">
          <div className="flex items-center rounded-md overflow-hidden" style={{ border: `2px solid ${brand.color}` }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2.5" style={{ color: brand.color }}>Grand Total</span>
            <span className="text-white font-bold text-[17px] px-5 py-2.5 tracking-wide" style={{ backgroundColor: brand.color }}>
              {formatCurrency(grandTotal, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* ===== SEPARATOR ===== */}
      <div className="relative z-10 mx-10">
        <div className="h-[2px]" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}30, transparent)` }} />
      </div>

      {/* ===== BOTTOM: Payment + Signature + Footer (flex-1 fills remaining) ===== */}
      <div className="relative z-10 flex-1 px-10 pt-5 pb-6 flex flex-col">
        {/* Payment Info + Signature */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: brand.color }}>Payment Information</p>
            <div className="text-gray-600 text-[12px] leading-[1.7]">
              {paymentBank && <p>Bank {paymentBank}</p>}
              {paymentAccount && <p>{paymentAccount}</p>}
              {paymentRecipient && <p>Recipient {paymentRecipient}</p>}
            </div>
          </div>

          <div className="text-right min-w-[170px]">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-0.5">Authorized by</p>
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

        {/* Custom fields */}
        {customFields && Object.keys(customFields).length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            {Object.entries(customFields).map(([key, value]) => (
              <div key={key} className="flex gap-3 text-[11px] py-0.5">
                <span className="font-medium text-gray-400 min-w-[100px]">{key}:</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ===== FOOTER (always at very bottom) ===== */}
        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-4">
            {/* QR Code */}
            {verificationToken && (
              <div className="flex items-end gap-3">
                <QRCode
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/invoice?token=${verificationToken}`}
                  size={72}
                />
                <div className="pb-0.5">
                  <p className="text-[7px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Scan to verify</p>
                  <p className="text-[7px] text-gray-300 font-mono leading-snug max-w-[120px] break-all">{verificationToken.slice(0, 16)}...</p>
                </div>
              </div>
            )}
            {/* Accent bars */}
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

      {/* Bottom accent bar */}
      <div className="relative z-10 h-[3px]" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}60, ${brand.color}15)` }} />
    </div>
  );
}
