'use client';

import { SERVICE_BRANDS, formatCurrency } from '@/lib/finance';
import type { ServiceBrand } from '@/lib/supabase';
import QRCode from './QRCode';

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
}: InvoiceDocumentProps) {
  const brand = SERVICE_BRANDS[serviceBrand];
  const docId = `DOC-${invoiceNumber.replace(/[^A-Za-z0-9]/g, '')}`;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  /* Repeating micro-pattern SVG for anti-forgery background */
  const patternSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><text x='150' y='150' font-family='Arial' font-size='9' fill='${brand.color}' fill-opacity='0.025' text-anchor='middle' dominant-baseline='middle' transform='rotate(-40 150 150)'>SAIKI GROUP OFFICIAL DOCUMENT</text><circle cx='30' cy='30' r='0.5' fill='${brand.color}' fill-opacity='0.03'/><circle cx='270' cy='270' r='0.5' fill='${brand.color}' fill-opacity='0.03'/><line x1='0' y1='300' x2='300' y2='0' stroke='${brand.color}' stroke-opacity='0.008' stroke-width='0.5'/></svg>`;

  return (
    <div
      className="bg-white mx-auto shadow-lg flex flex-col relative overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif",
        width: '210mm',
        minHeight: '297mm',
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`,
        backgroundSize: '300px 300px',
      }}
    >
      {/* ===== TOP COLORED BAND ===== */}
      <div style={{ backgroundColor: brand.color }} className="relative">
        {/* Geometric accent - diagonal cut */}
        <div className="absolute right-0 top-0 bottom-0 w-[35%]" style={{ backgroundColor: brand.color, opacity: 0.7 }} />
        <div className="absolute right-[35%] top-0 bottom-0 w-[60px]" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}B3)` }} />

        <div className="relative z-10 px-12 py-8 flex items-start justify-between">
          {/* Left: Service brand logo */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logoWhite} alt={brand.label} className="h-8 brightness-0 invert" />
          </div>

          {/* Right: INVOICE title + number */}
          <div className="text-right">
            <h1
              className="text-white font-bold tracking-[0.15em] leading-none"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '36px' }}
            >
              INVOICE
            </h1>
            <div className="mt-2 text-[12px] text-white/60 leading-relaxed">
              <p>No: <span className="text-white font-medium">{invoiceNumber}</span></p>
              <p>Issued: <span className="text-white font-medium">{formatDate(issuedDate)}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SAIKI GROUP sub-header ===== */}
      <div className="px-12 py-3 flex items-center justify-between border-b" style={{ borderColor: `${brand.color}15` }}>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/saiki-main-logo-01.svg" alt="SAIKI Group" className="h-7" />
          <div className="h-5 w-[1px]" style={{ backgroundColor: `${brand.color}30` }} />
          <span className="text-[10px] text-gray-400 tracking-[0.15em] uppercase font-medium">Official Document</span>
        </div>
        <span className="text-[9px] text-gray-300 font-mono">{docId}</span>
      </div>

      {/* ===== BILLED TO ===== */}
      <div className="px-12 pt-8 pb-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: brand.color }}>Billed To</p>
        <p className="font-bold text-gray-900 text-[16px] leading-tight">{clientName}</p>
        <p className="text-gray-500 text-[12px] leading-relaxed mt-1.5 whitespace-pre-line">{clientAddress}</p>
      </div>

      {/* ===== ITEMS TABLE ===== */}
      <div className="px-12 pb-6">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] pb-3 pt-1 w-[36px] border-b-2" style={{ color: brand.color, borderColor: brand.color }}>No</th>
              <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] pb-3 pt-1 border-b-2" style={{ color: brand.color, borderColor: brand.color }}>Deskripsi</th>
              <th className="text-center text-[9px] font-bold uppercase tracking-[0.2em] pb-3 pt-1 w-[65px] border-b-2" style={{ color: brand.color, borderColor: brand.color }}>Jumlah</th>
              <th className="text-right text-[9px] font-bold uppercase tracking-[0.2em] pb-3 pt-1 w-[110px] border-b-2" style={{ color: brand.color, borderColor: brand.color }}>Harga</th>
              <th className="text-right text-[9px] font-bold uppercase tracking-[0.2em] pb-3 pt-1 w-[110px] border-b-2" style={{ color: brand.color, borderColor: brand.color }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="text-gray-400 text-[13px] py-4 align-top">{idx + 1}</td>
                <td className="text-gray-800 text-[13px] py-4 pr-6 align-top leading-relaxed">{item.description}</td>
                <td className="text-gray-600 text-[13px] py-4 text-center align-top">{item.quantity}</td>
                <td className="text-gray-600 text-[13px] py-4 text-right align-top whitespace-nowrap">{formatCurrency(item.unit_price, currency)}</td>
                <td className="text-gray-900 text-[13px] py-4 text-right align-top whitespace-nowrap font-semibold">{formatCurrency(item.subtotal, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Grand Total box */}
        <div className="flex items-center justify-end mt-6">
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `2px solid ${brand.color}` }}>
            <span className="text-[12px] font-bold uppercase tracking-[0.15em] px-5 py-3" style={{ color: brand.color }}>Grand Total</span>
            <span className="text-white font-bold text-[18px] px-6 py-3 tracking-wide" style={{ backgroundColor: brand.color }}>
              {formatCurrency(grandTotal, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* ===== SEPARATOR ===== */}
      <div className="mx-12">
        <div className="h-[2px]" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}30, transparent)` }} />
      </div>

      {/* ===== BOTTOM SECTION (flex-1 pushes to fill page) ===== */}
      <div className="flex-1 px-12 pt-6 pb-8 flex flex-col">
        {/* Payment Info + Signature */}
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: brand.color }}>Payment Information</p>
            <div className="text-gray-600 text-[13px] leading-[1.8]">
              {paymentBank && <p>Bank {paymentBank}</p>}
              {paymentAccount && <p>{paymentAccount}</p>}
              {paymentRecipient && <p>Recipient {paymentRecipient}</p>}
            </div>
          </div>

          <div className="text-right min-w-[200px]">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">Authorized by</p>
            <p className="text-[11px] font-semibold tracking-wider" style={{ color: brand.color }}>SAIKI GROUP</p>
            {signerName ? (
              <div className="mt-3 pb-1 border-b" style={{ borderColor: `${brand.color}30` }}>
                <span style={{ fontFamily: "'Bastliga One', cursive", fontSize: '24px', color: '#1a1a2e' }}>{signerName}</span>
              </div>
            ) : (
              <div className="w-48 h-16 border-b mt-3" style={{ borderColor: `${brand.color}30` }} />
            )}
          </div>
        </div>

        {/* Custom fields */}
        {customFields && Object.keys(customFields).length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            {Object.entries(customFields).map(([key, value]) => (
              <div key={key} className="flex gap-4 text-[12px] py-1">
                <span className="font-medium text-gray-400 min-w-[110px]">{key}:</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ===== FOOTER (always at bottom) ===== */}
        <div className="mt-auto pt-10">
          {/* QR + Legal disclaimer */}
          <div className="flex items-end justify-between gap-6">
            {/* Left: verification QR */}
            {verificationToken && (
              <div className="flex items-end gap-4">
                <QRCode
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/invoice?token=${verificationToken}`}
                  size={80}
                />
                <div className="pb-1">
                  <p className="text-[8px] text-gray-400 font-medium uppercase tracking-wider mb-1">Scan to verify</p>
                  <p className="text-[8px] text-gray-300 font-mono max-w-[140px] break-all leading-snug">{verificationToken.slice(0, 16)}...</p>
                </div>
              </div>
            )}

            {/* Right: accent bars */}
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
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-[8px] text-gray-400 leading-relaxed max-w-[85%]">
              This document is electronically generated by SAIKI Group&apos;s authorized billing system and is valid without a wet ink signature.
              To verify the authenticity of this document, scan the QR code above or visit the verification URL.
              Unauthorized reproduction or alteration of this document is strictly prohibited and may be subject to legal action.
            </p>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM ACCENT BAR ===== */}
      <div className="h-[4px]" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}60, ${brand.color}20)` }} />
    </div>
  );
}
