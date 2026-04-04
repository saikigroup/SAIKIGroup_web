'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/finance';
import type { SaikiwebInvoice, SaikiwebReceipt } from '@/lib/supabase';

const brandColors: Record<string, { primary: string; accent: string; label: string; sublabel: string }> = {
  consultancy: { primary: '#6B1D3A', accent: '#8B2D4A', label: 'SAIKI Consultancy', sublabel: 'Consultancy' },
  technology: { primary: '#0D4F4F', accent: '#0d9488', label: 'SAIKI Technology', sublabel: 'Technology' },
  imagery: { primary: '#1a1a2e', accent: '#2d2d44', label: 'SAIKI Imagery', sublabel: 'Imagery' },
};

interface PaymentRef {
  label: string;
  badgeColor: string;
  value: string;
}

interface AmountRow {
  label: string;
  value: string;
}

interface SendEmailModalProps {
  invoice?: SaikiwebInvoice | null;
  receipt?: SaikiwebReceipt | null;
  onClose: () => void;
  onSent: () => void;
}

export default function SendEmailModal({ invoice, receipt, onClose, onSent }: SendEmailModalProps) {
  const brand = invoice?.saikiweb_service_brand || receipt?.saikiweb_service_brand || 'consultancy';
  const brandInfo = brandColors[brand] || brandColors.consultancy;
  const clientName = invoice?.saikiweb_client_name || receipt?.saikiweb_client_name || '';
  const clientEmail = invoice?.saikiweb_client_email || '';

  // Build default subject
  const defaultSubject = (() => {
    if (invoice && receipt) {
      return `[${clientName}] - Payment Receipt for ${invoice.saikiweb_notes || 'Project'}`;
    }
    if (invoice) {
      return `[${clientName}] - Invoice ${invoice.saikiweb_invoice_number}`;
    }
    if (receipt) {
      return `[${clientName}] - Payment Receipt ${receipt.saikiweb_receipt_number}`;
    }
    return '';
  })();

  // Build default body
  const defaultBody = (() => {
    if (receipt) {
      return `<p><strong>Dear ${clientName},</strong></p>
<p>Thank you for your order and for the payment received for the development of <strong>"${receipt.saikiweb_payment_for}"</strong>.</p>`;
    }
    if (invoice) {
      return `<p><strong>Dear ${clientName},</strong></p>
<p>Please find attached the invoice for the services provided. Kindly review and process the payment at your earliest convenience.</p>`;
    }
    return `<p><strong>Dear ${clientName},</strong></p>`;
  })();

  // Build default payment references
  const defaultRefs: PaymentRef[] = [];
  const defaultAmounts: AmountRow[] = [];

  if (receipt) {
    defaultRefs.push({
      label: 'Receipt',
      badgeColor: brandInfo.primary,
      value: `${receipt.saikiweb_receipt_number} (${new Date(receipt.saikiweb_receipt_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`,
    });
    defaultAmounts.push({
      label: 'Payment Received',
      value: formatCurrency(receipt.saikiweb_amount, receipt.saikiweb_currency),
    });
    if (receipt.saikiweb_package_value) {
      defaultAmounts.push({
        label: 'Contract Value',
        value: formatCurrency(receipt.saikiweb_package_value, receipt.saikiweb_currency),
      });
    }
  }

  if (invoice) {
    defaultRefs.push({
      label: 'Invoice',
      badgeColor: '#374151',
      value: `${invoice.saikiweb_invoice_number} (${new Date(invoice.saikiweb_issued_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`,
    });
    if (!receipt) {
      defaultAmounts.push({
        label: 'Total Amount',
        value: formatCurrency(invoice.saikiweb_grand_total, invoice.saikiweb_currency),
      });
    }
  }

  const defaultClosing = receipt
    ? '<p>We will proceed with the project kickoff and preparation activities based on the agreed milestones. We will share the kickoff schedule and the required access/data upload templates in a separate email.</p>'
    : '<p>Please do not hesitate to contact us if you have any questions regarding this invoice.</p>';

  const defaultAttachedDocs = (() => {
    const docs: string[] = [];
    if (invoice) docs.push(`Invoice (${invoice.saikiweb_invoice_number})`);
    if (receipt) docs.push(`Payment Receipt (${receipt.saikiweb_receipt_number})`);
    return docs.length > 0 ? `Attached documents: ${docs.join(' and ')}.` : '';
  })();

  const [form, setForm] = useState({
    to: clientEmail,
    subject: defaultSubject,
    emailBody: defaultBody,
    closingMessage: defaultClosing,
    attachedDocsList: defaultAttachedDocs,
  });

  const [refs, setRefs] = useState<PaymentRef[]>(defaultRefs);
  const [amounts, setAmounts] = useState<AmountRow[]>(defaultAmounts);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const addRef = () => setRefs((prev) => [...prev, { label: '', badgeColor: brandInfo.primary, value: '' }]);
  const removeRef = (idx: number) => setRefs((prev) => prev.filter((_, i) => i !== idx));
  const addAmount = () => setAmounts((prev) => [...prev, { label: '', value: '' }]);
  const removeAmount = (idx: number) => setAmounts((prev) => prev.filter((_, i) => i !== idx));

  const handleSend = async () => {
    if (!form.to || !form.subject) {
      setError('Recipient email and subject are required');
      return;
    }

    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/admin/invoices/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify({
          to: form.to,
          subject: form.subject,
          emailBody: form.emailBody,
          closingMessage: form.closingMessage,
          serviceBrand: brand,
          clientName,
          paymentReferences: refs.filter((r) => r.label && r.value),
          amounts: amounts.filter((a) => a.label && a.value),
          attachedDocsList: form.attachedDocsList,
          invoiceId: invoice?.saikiweb_invoice_id,
          receiptId: receipt?.saikiweb_receipt_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSent();
      } else {
        setError(data.error || 'Failed to send email');
      }
    } catch {
      setError('Connection error');
    }
    setSending(false);
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

  // Preview HTML
  const previewHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc;">
      <div style="height: 6px; background: linear-gradient(to right, ${brandInfo.primary} 50%, ${brandInfo.accent} 50%);"></div>
      <div style="background: #ffffff; padding: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div>
            <h2 style="margin: 0; font-size: 22px; color: #1a1a2e; font-weight: 700;">SAIKI<span style="color: #94a3b8; font-weight: 400;">GROUP</span></h2>
            <p style="margin: 2px 0 0; color: #94a3b8; font-size: 11px;">Beyond Your Needs</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 13px; color: #1a1a2e;"><strong>SAIKI</strong> Group</p>
            <p style="margin: 2px 0 0; font-size: 13px;">
              <span style="display: inline-block; background: ${brandInfo.primary}; color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">SAIKI</span>
              <span style="color: #1a1a2e; margin-left: 4px;">${brandInfo.sublabel}</span>
            </p>
          </div>
        </div>
        <div style="color: #1a1a2e; font-size: 15px; line-height: 1.7;">${form.emailBody}</div>
        ${refs.length > 0 ? `
          <div style="margin: 24px 0; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <p style="margin: 0 0 12px; color: #94a3b8; font-size: 13px;">Payment References</p>
            ${refs.filter(r => r.label && r.value).map(ref => `
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block; background: ${ref.badgeColor}; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-right: 8px;">${ref.label}</span>
                <span style="color: #1a1a2e; font-size: 14px;">${ref.value}</span>
              </div>
            `).join('')}
            ${amounts.filter(a => a.label && a.value).length > 0 ? `
              <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                ${amounts.filter(a => a.label && a.value).map(a => `
                  <div style="margin-bottom: 4px;">
                    <span style="color: #64748b; font-size: 14px; margin-right: 16px;">${a.label}</span>
                    <span style="color: #1a1a2e; font-size: 14px; font-weight: 600; float: right;">${a.value}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${form.attachedDocsList ? `
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #94a3b8; font-size: 12px;">${form.attachedDocsList}</p>
              </div>
            ` : ''}
          </div>
        ` : ''}
        ${form.closingMessage ? `<div style="color: #1a1a2e; font-size: 15px; line-height: 1.7; margin-top: 20px;">${form.closingMessage}</div>` : ''}
        <div style="margin-top: 28px; color: #1a1a2e; font-size: 15px;">
          <p style="margin: 0;">Sincerely,</p>
          <p style="margin: 4px 0 0;"><strong style="color: ${brandInfo.primary};">SAIKI</strong> <strong>Group</strong></p>
        </div>
      </div>
      <div style="padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">This email is intended for ${clientName}. If you received this in error, please notify the sender.</p>
      </div>
    </div>
  `;

  if (showPreview) {
    return (
      <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowPreview(false)} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-lg font-bold text-gray-900">Email Preview</h2>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">Back to Edit</button>
              <button onClick={handleSend} disabled={sending} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition disabled:opacity-50">
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-4 space-y-1">
              <p className="text-sm text-gray-500">To: <span className="text-gray-900">{form.to}</span></p>
              <p className="text-sm text-gray-500">Subject: <span className="font-medium text-gray-900">{form.subject}</span></p>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">Send Email</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Brand indicator */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandInfo.primary }} />
            <span className="text-sm font-medium" style={{ color: brandInfo.primary }}>{brandInfo.label}</span>
          </div>

          {/* To & Subject */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelCls}>To (Email)</label>
              <input type="email" value={form.to} onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Subject</label>
              <input type="text" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className={inputCls} required />
            </div>
          </div>

          {/* Email Body */}
          <div>
            <label className={labelCls}>Email Body (HTML)</label>
            <textarea value={form.emailBody} onChange={(e) => setForm((f) => ({ ...f, emailBody: e.target.value }))} className={inputCls} rows={4} />
          </div>

          {/* Payment References */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Payment References</h3>
              <button type="button" onClick={addRef} className="text-xs text-teal-600 hover:text-teal-700 font-medium">+ Add Reference</button>
            </div>
            {refs.map((ref, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" placeholder="Label (e.g. Receipt)" value={ref.label} onChange={(e) => setRefs((prev) => prev.map((r, i) => i === idx ? { ...r, label: e.target.value } : r))} className={`${inputCls} w-24 shrink-0`} />
                <input type="color" value={ref.badgeColor} onChange={(e) => setRefs((prev) => prev.map((r, i) => i === idx ? { ...r, badgeColor: e.target.value } : r))} className="w-8 h-8 rounded cursor-pointer border border-gray-200 shrink-0" />
                <input type="text" placeholder="Value" value={ref.value} onChange={(e) => setRefs((prev) => prev.map((r, i) => i === idx ? { ...r, value: e.target.value } : r))} className={`${inputCls} flex-1`} />
                <button type="button" onClick={() => removeRef(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <h4 className="text-xs font-medium text-gray-600">Amounts</h4>
              <button type="button" onClick={addAmount} className="text-xs text-teal-600 hover:text-teal-700 font-medium">+ Add Amount</button>
            </div>
            {amounts.map((a, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" placeholder="Label" value={a.label} onChange={(e) => setAmounts((prev) => prev.map((am, i) => i === idx ? { ...am, label: e.target.value } : am))} className={`${inputCls} flex-1`} />
                <input type="text" placeholder="Value (e.g. IDR 22,500,000)" value={a.value} onChange={(e) => setAmounts((prev) => prev.map((am, i) => i === idx ? { ...am, value: e.target.value } : am))} className={`${inputCls} flex-1`} />
                <button type="button" onClick={() => removeAmount(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}

            <div>
              <label className={labelCls}>Attached Documents Note</label>
              <input type="text" value={form.attachedDocsList} onChange={(e) => setForm((f) => ({ ...f, attachedDocsList: e.target.value }))} className={inputCls} />
            </div>
          </div>

          {/* Closing Message */}
          <div>
            <label className={labelCls}>Closing Message (HTML)</label>
            <textarea value={form.closingMessage} onChange={(e) => setForm((f) => ({ ...f, closingMessage: e.target.value }))} className={inputCls} rows={3} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="button" onClick={() => setShowPreview(true)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition">Preview</button>
            <button type="button" onClick={handleSend} disabled={sending} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition disabled:opacity-50">
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
