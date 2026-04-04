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

/* SVG anti-forgery watermark pattern rendered as background */
function WatermarkPattern({ color }: { color: string }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><text x="50%" y="50%" font-family="Arial" font-size="10" fill="${color}" fill-opacity="0.04" text-anchor="middle" dominant-baseline="middle" transform="rotate(-35 100 100)">SAIKI GROUP</text><circle cx="20" cy="20" r="1" fill="${color}" fill-opacity="0.03"/><circle cx="180" cy="180" r="1" fill="${color}" fill-opacity="0.03"/></svg>`;
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{ backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, backgroundSize: '200px 200px' }}
    />
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
        minHeight: '297mm',
      }}
    >
      <WatermarkPattern color={brand.color} />

      {/* Thin accent strip at very top */}
      <div className="flex h-[5px] relative z-10">
        <div className="flex-1" style={{ backgroundColor: brand.color }} />
        <div className="w-[40%]" style={{ backgroundColor: brand.color, opacity: 0.6 }} />
      </div>

      {/* Header row: logo left, invoice # right */}
      <div className="relative z-10 px-12 pt-8 pb-6 flex items-start justify-between">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/saiki-main-logo-01.svg" alt="SAIKI" className="h-10 mb-3" />
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logoWhite} alt={brand.label} className="h-5" style={{ filter: 'brightness(0)' }} />
          </div>
        </div>
        <div className="text-right">
          <h1
            className="font-bold tracking-[0.12em] mb-2"
            style={{ fontFamily: "'Georgia', serif", fontSize: '38px', color: brand.color, lineHeight: 1 }}
          >
            INVOICE
          </h1>
          <p className="text-[12px] text-gray-400">No: <span className="text-gray-700 font-medium">{invoiceNumber}</span></p>
          <p className="text-[12px] text-gray-400">Issued: <span className="text-gray-700 font-medium">{formatDate(issuedDate)}</span></p>
        </div>
      </div>

      {/* Separator line */}
      <div className="mx-12 h-[2px] relative z-10" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}40, transparent)` }} />

      {/* Billed To */}
      <div className="relative z-10 px-12 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: brand.color }}>Billed To</p>
        <p className="font-bold text-gray-900 text-[15px]">{clientName}</p>
        <p className="text-gray-500 text-[12px] leading-relaxed mt-1 whitespace-pre-line">{clientAddress}</p>
      </div>

      {/* Items table */}
      <div className="relative z-10 px-12 pb-4">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${brand.color}` }}>
              <th className="text-left text-[10px] font-bold uppercase tracking-wider py-3 w-[40px]" style={{ color: brand.color }}>No</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-wider py-3" style={{ color: brand.color }}>Deskripsi</th>
              <th className="text-center text-[10px] font-bold uppercase tracking-wider py-3 w-[70px]" style={{ color: brand.color }}>Jumlah</th>
              <th className="text-right text-[10px] font-bold uppercase tracking-wider py-3 w-[115px]" style={{ color: brand.color }}>Harga</th>
              <th className="text-right text-[10px] font-bold uppercase tracking-wider py-3 w-[115px]" style={{ color: brand.color }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td className="text-gray-400 text-[13px] py-4 align-top">{idx + 1}</td>
                <td className="text-gray-800 text-[13px] py-4 pr-4 align-top leading-snug">{item.description}</td>
                <td className="text-gray-600 text-[13px] py-4 text-center align-top">{item.quantity}</td>
                <td className="text-gray-600 text-[13px] py-4 text-right align-top whitespace-nowrap">{formatCurrency(item.unit_price, currency)}</td>
                <td className="text-gray-900 text-[13px] py-4 text-right align-top whitespace-nowrap font-medium">{formatCurrency(item.subtotal, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grand Total */}
      <div className="relative z-10 px-12 pb-6">
        <div className="flex items-center justify-end gap-5">
          <span className="text-gray-400 font-bold text-[12px] uppercase tracking-wider">Grand Total</span>
          <div
            className="font-bold px-6 py-3 rounded-md"
            style={{ backgroundColor: brand.color, color: '#ffffff', fontSize: '20px', letterSpacing: '0.5px' }}
          >
            {formatCurrency(grandTotal, currency)}
          </div>
        </div>
      </div>

      {/* Thick colored divider */}
      <div className="mx-12 h-[3px] relative z-10" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}60)` }} />

      {/* Bottom section: Payment + Signature + QR - flex-1 to push to bottom */}
      <div className="relative z-10 flex-1 px-12 pt-6 pb-8 flex flex-col justify-between">
        {/* Payment info + Signature */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: brand.color }}>Payment Information</p>
            {paymentBank && <p className="text-gray-600 text-[13px] leading-loose">Bank {paymentBank}</p>}
            {paymentAccount && <p className="text-gray-600 text-[13px] leading-loose">{paymentAccount}</p>}
            {paymentRecipient && <p className="text-gray-600 text-[13px] leading-loose">Recipient {paymentRecipient}</p>}
          </div>

          <div className="text-right min-w-[180px]">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.15em] mb-1">Authorized by</p>
            <p className="text-[11px] text-gray-500 font-semibold tracking-wider">SAIKI GROUP</p>
            {signerName ? (
              <div className="mt-2 pb-1 border-b border-gray-200">
                <span style={{ fontFamily: "'Bastliga One', cursive", fontSize: '26px', color: '#1a1a2e' }}>{signerName}</span>
              </div>
            ) : (
              <div className="w-44 h-16 border-b border-gray-200 mt-3" />
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

        {/* Bottom bar: accent line + QR */}
        <div className="flex items-end justify-between mt-auto pt-8">
          {/* Left accent marks */}
          <div className="flex items-end gap-[2px]">
            <div style={{ width: '4px', height: '32px', backgroundColor: brand.color, opacity: 0.8, borderRadius: '2px 2px 0 0' }} />
            <div style={{ width: '4px', height: '24px', backgroundColor: brand.color, opacity: 0.5, borderRadius: '2px 2px 0 0' }} />
            <div style={{ width: '4px', height: '16px', backgroundColor: brand.color, opacity: 0.3, borderRadius: '2px 2px 0 0' }} />
          </div>

          {/* QR Code */}
          {verificationToken && (
            <QRCode
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/invoice?token=${verificationToken}`}
              size={56}
            />
          )}
        </div>
      </div>

      {/* Bottom accent strip */}
      <div className="h-[3px] relative z-10" style={{ background: `linear-gradient(to right, ${brand.color}, ${brand.color}50, transparent)` }} />
    </div>
  );
}
