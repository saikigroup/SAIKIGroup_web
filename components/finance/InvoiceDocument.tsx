'use client';

import { SERVICE_BRANDS, formatCurrency } from '@/lib/finance';
import type { ServiceBrand } from '@/lib/supabase';

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
}: InvoiceDocumentProps) {
  const brand = SERVICE_BRANDS[serviceBrand];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-white w-full max-w-[210mm] mx-auto shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Decorative corner elements */}
      <div className="relative">
        {/* Top-left decorative blocks */}
        <div className="absolute top-0 left-0 w-20 h-20 z-10">
          <div className="absolute top-4 left-4 w-10 h-10 rounded" style={{ backgroundColor: brand.color, opacity: 0.3 }} />
          <div className="absolute top-8 left-8 w-10 h-10 rounded" style={{ backgroundColor: brand.color, opacity: 0.5 }} />
        </div>

        {/* Top-right decorative grid */}
        <div className="absolute top-2 right-2 grid grid-cols-3 gap-1 z-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3"
              style={{
                backgroundColor: i % 3 === 0 ? brand.color : 'transparent',
                border: `1px solid ${brand.color}`,
                opacity: 0.4 + (i * 0.06),
              }}
            />
          ))}
        </div>

        {/* SAIKI logo top-left */}
        <div className="pt-6 pl-6 pb-2">
          <img src="/brand/saiki main logo-01.svg" alt="SAIKI" className="h-8" />
        </div>

        {/* Main header area */}
        <div className="mx-4 rounded-t-lg overflow-hidden" style={{ backgroundColor: brand.headerBg }}>
          <div className="px-8 py-6">
            {/* Brand logo */}
            <div className="flex items-center gap-3 mb-4">
              <img src={brand.logoWhite} alt={brand.label} className="h-8 brightness-0 invert" />
            </div>

            {/* INVOICE title */}
            <div className="flex items-start justify-between">
              <h1 className="text-white text-4xl font-bold tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                INVOICE
              </h1>
              <div className="text-right text-white/80 text-sm">
                <p>No: {invoiceNumber}</p>
                <p>Issued: {formatDate(issuedDate)}</p>
              </div>
            </div>
          </div>

          {/* Billed To - overlapping section */}
          <div className="px-8 pb-6">
            <div className="bg-white rounded-lg px-4 py-3 inline-block shadow-sm" style={{ marginLeft: '-1rem' }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: brand.color }}>Billed To:</p>
              <p className="font-bold text-gray-900 text-sm mt-1">{clientName}</p>
              <p className="text-gray-600 text-xs whitespace-pre-line">{clientAddress}</p>
            </div>
          </div>

          {/* Items table */}
          <div className="px-8 pb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="text-left text-white/80 text-xs font-bold uppercase py-2 w-12">No</th>
                  <th className="text-left text-white/80 text-xs font-bold uppercase py-2">Deskripsi</th>
                  <th className="text-center text-white/80 text-xs font-bold uppercase py-2 w-20">Jumlah</th>
                  <th className="text-right text-white/80 text-xs font-bold uppercase py-2 w-28">Harga</th>
                  <th className="text-right text-white/80 text-xs font-bold uppercase py-2 w-28">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/10">
                    <td className="text-white text-sm py-3">{idx + 1}</td>
                    <td className="text-white text-sm py-3">{item.description}</td>
                    <td className="text-white text-sm py-3 text-center">{item.quantity}</td>
                    <td className="text-white text-sm py-3 text-right">{formatCurrency(item.unit_price, currency)}</td>
                    <td className="text-white text-sm py-3 text-right">{formatCurrency(item.subtotal, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="px-8 pb-6">
            <div className="flex items-center justify-end gap-4">
              <span className="text-white font-bold text-sm uppercase tracking-wider">Grand Total</span>
              <div className="bg-white text-gray-900 font-bold px-6 py-2 rounded text-lg">
                {formatCurrency(grandTotal, currency)}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information & Signature */}
        <div className="mx-4 px-8 py-6 flex items-end justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-2">PAYMENT INFORMATION:</h3>
            {paymentBank && <p className="text-gray-700 text-sm">Bank {paymentBank}</p>}
            {paymentAccount && <p className="text-gray-700 text-sm">{paymentAccount}</p>}
            {paymentRecipient && <p className="text-gray-700 text-sm">Recipient {paymentRecipient}</p>}
          </div>

          <div className="text-right">
            <img src="/brand/saiki main logo-01.svg" alt="SAIKI Group" className="h-6 ml-auto mb-1" />
            <p className="text-xs text-gray-500">SAIKI GROUP</p>
            <div className="w-32 h-12 border-b border-gray-300 mt-2" />
          </div>
        </div>

        {/* Custom fields */}
        {customFields && Object.keys(customFields).length > 0 && (
          <div className="mx-4 px-8 pb-6">
            <div className="border-t border-gray-200 pt-4">
              {Object.entries(customFields).map(([key, value]) => (
                <div key={key} className="flex gap-4 text-sm py-1">
                  <span className="font-medium text-gray-600 min-w-[120px]">{key}:</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom decorative elements */}
        <div className="relative h-16 mx-4">
          <div className="absolute bottom-0 left-0">
            <div className="flex gap-0.5">
              {[0.8, 0.6, 0.4].map((opacity, i) => (
                <div
                  key={i}
                  className="w-6 h-12 rounded-t"
                  style={{ backgroundColor: brand.color, opacity }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
