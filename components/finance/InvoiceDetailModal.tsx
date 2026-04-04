'use client';

import { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '@/lib/finance';
import { downloadElementAsPDF } from '@/lib/pdf';
import type { SaikiwebInvoice, SaikiwebInvoiceItem, ServiceBrand } from '@/lib/supabase';
import InvoiceDocument from './InvoiceDocument';

interface InvoiceDetailModalProps {
  invoice: SaikiwebInvoice;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRecordPayment: () => void;
  onCreateReceipt: () => void;
  onSendEmail: () => void;
}

export default function InvoiceDetailModal({ invoice, onClose, onEdit, onDelete, onRecordPayment, onCreateReceipt, onSendEmail }: InvoiceDetailModalProps) {
  const [items, setItems] = useState<SaikiwebInvoiceItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw || !invoice.saikiweb_invoice_id) return;
    fetch(`/api/admin/invoices/items?invoice_id=${invoice.saikiweb_invoice_id}`, {
      headers: { 'x-admin-password': pw },
    })
      .then((r) => r.json())
      .then((data) => { if (data.success) setItems(data.data); })
      .catch(() => {});
  }, [invoice.saikiweb_invoice_id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/invoices?id=${invoice.saikiweb_invoice_id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) onDelete();
    } catch {
      alert('Failed to delete');
    }
    setDeleting(false);
  };

  const verifyUrl = invoice.saikiweb_verification_token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/invoice?token=${invoice.saikiweb_verification_token}`
    : null;

  const copyVerifyUrl = () => {
    if (verifyUrl) {
      navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (showPreview) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-black/60" onClick={() => setShowPreview(false)} />
        <div className="relative my-8 w-full max-w-[210mm]">
          <div className="absolute -top-2 -right-2 z-10 flex items-center gap-2">
            <button
              onClick={async () => {
                if (!previewRef.current) return;
                setDownloading(true);
                try {
                  await downloadElementAsPDF(previewRef.current, `${invoice.saikiweb_invoice_number}.pdf`);
                } catch { /* ignore */ }
                setDownloading(false);
              }}
              disabled={downloading}
              className="bg-teal-600 text-white rounded-full p-2 shadow-lg hover:bg-teal-700 disabled:opacity-50"
              title="Download PDF"
            >
              {downloading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              )}
            </button>
            <button onClick={() => setShowPreview(false)} className="bg-white rounded-full p-2 shadow-lg text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div ref={previewRef}>
          <InvoiceDocument
            invoiceNumber={invoice.saikiweb_invoice_number}
            serviceBrand={invoice.saikiweb_service_brand}
            clientName={invoice.saikiweb_client_name}
            clientAddress={invoice.saikiweb_client_address}
            issuedDate={invoice.saikiweb_issued_date}
            items={items.map((it) => ({ description: it.saikiweb_description, quantity: it.saikiweb_quantity, unit_price: it.saikiweb_unit_price, subtotal: it.saikiweb_subtotal }))}
            grandTotal={invoice.saikiweb_grand_total}
            currency={invoice.saikiweb_currency}
            paymentBank={invoice.saikiweb_payment_bank}
            paymentAccount={invoice.saikiweb_payment_account}
            paymentRecipient={invoice.saikiweb_payment_recipient}
            customFields={invoice.saikiweb_custom_fields || undefined}
            verificationToken={invoice.saikiweb_verification_token || undefined}
            signerName={invoice.saikiweb_signer_name || undefined}
          />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">Invoice Detail</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Top info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Invoice #</p>
              <p className="font-mono font-medium text-gray-900">{invoice.saikiweb_invoice_number}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <p className="font-medium text-gray-900 capitalize">{invoice.saikiweb_status}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Brand</p>
              <p className="font-medium text-gray-900 capitalize">{invoice.saikiweb_service_brand}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Client</p>
              <p className="font-medium text-gray-900">{invoice.saikiweb_client_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Issued</p>
              <p className="text-gray-900">{formatDate(invoice.saikiweb_issued_date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Due</p>
              <p className="text-gray-900">{formatDate(invoice.saikiweb_due_date)}</p>
            </div>
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Items</p>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-2 text-xs text-gray-500">#</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-500">Description</th>
                    <th className="text-center px-4 py-2 text-xs text-gray-500">Qty</th>
                    <th className="text-right px-4 py-2 text-xs text-gray-500">Price</th>
                    <th className="text-right px-4 py-2 text-xs text-gray-500">Subtotal</th>
                  </tr></thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr key={it.saikiweb_item_id} className="border-b border-gray-100">
                        <td className="px-4 py-2 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-2">{it.saikiweb_description}</td>
                        <td className="px-4 py-2 text-center">{it.saikiweb_quantity}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(it.saikiweb_unit_price, invoice.saikiweb_currency)}</td>
                        <td className="px-4 py-2 text-right font-medium">{formatCurrency(it.saikiweb_subtotal, invoice.saikiweb_currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="text-right">
            <span className="text-sm text-gray-500 mr-4">Grand Total</span>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(invoice.saikiweb_grand_total, invoice.saikiweb_currency)}</span>
          </div>

          {/* Verification URL */}
          {verifyUrl && (
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600 font-medium mb-1">Verification URL</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded flex-1 truncate">{verifyUrl}</code>
                <button onClick={copyVerifyUrl} className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Sent status */}
          {invoice.saikiweb_sent_at && (
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-green-600 font-medium">Email sent on {formatDate(invoice.saikiweb_sent_at)}</p>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            <button onClick={() => setShowPreview(true)} className="py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition">
              Preview
            </button>
            <button onClick={onSendEmail} className="py-2.5 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700 transition">
              Send Email
            </button>
            <button onClick={onEdit} className="py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition">
              Edit
            </button>
            <button onClick={onRecordPayment} className="py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition">
              Record Payment
            </button>
            <button onClick={onCreateReceipt} className="py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
              Create Receipt
            </button>
            <button onClick={handleDelete} disabled={deleting} className="py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition disabled:opacity-50 sm:col-start-3">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
