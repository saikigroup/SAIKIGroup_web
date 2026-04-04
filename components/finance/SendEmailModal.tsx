'use client';

import { useState, useEffect } from 'react';
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
    // Add linked invoice as reference
    if (invoice) {
      defaultRefs.push({
        label: 'Invoice',
        badgeColor: '#374151',
        value: `${invoice.saikiweb_invoice_number} (${new Date(invoice.saikiweb_issued_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`,
      });
    }
    // Add SPK/reference if available
    if (receipt.saikiweb_reference) {
      defaultRefs.push({
        label: 'SPK',
        badgeColor: '#1e40af',
        value: receipt.saikiweb_reference,
      });
    }
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
  } else if (invoice) {
    defaultRefs.push({
      label: 'Invoice',
      badgeColor: '#374151',
      value: `${invoice.saikiweb_invoice_number} (${new Date(invoice.saikiweb_issued_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})`,
    });
    defaultAmounts.push({
      label: 'Total Amount',
      value: formatCurrency(invoice.saikiweb_grand_total, invoice.saikiweb_currency),
    });
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
  const [linkedReceipts, setLinkedReceipts] = useState<{ id: number; number: string; amount: number }[]>([]);
  const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(receipt?.saikiweb_receipt_id || null);

  // Fetch linked receipts when opened from invoice context (to allow bundling)
  useEffect(() => {
    if (!invoice?.saikiweb_invoice_id || receipt) return;
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    fetch(`/api/admin/receipts?search=${encodeURIComponent(invoice.saikiweb_client_name)}`, {
      headers: { 'x-admin-password': pw },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          const linked = data.data
            .filter((r: Record<string, unknown>) => r.saikiweb_invoice_id === invoice.saikiweb_invoice_id)
            .map((r: Record<string, unknown>) => ({
              id: r.saikiweb_receipt_id as number,
              number: r.saikiweb_receipt_number as string,
              amount: r.saikiweb_amount as number,
            }));
          setLinkedReceipts(linked);
        }
      })
      .catch(() => {});
  }, [invoice, receipt]);

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
          receiptId: receipt?.saikiweb_receipt_id || selectedReceiptId,
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

  // Preview HTML - matches the actual email template
  const refsHtml = refs.filter(r => r.label && r.value).length > 0 ? `
    <div style="margin: 28px 0; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
      <div style="background: ${brandInfo.primary}08; padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
        <p style="margin: 0; color: ${brandInfo.primary}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Document References</p>
      </div>
      <div style="padding: 16px 20px;">
        ${refs.filter(r => r.label && r.value).map(ref => `
          <div style="margin-bottom: 10px;">
            <span style="display: inline-block; background: ${ref.badgeColor}; color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; margin-right: 10px;">${ref.label}</span>
            <span style="color: #334155; font-size: 14px;">${ref.value}</span>
          </div>
        `).join('')}
        ${amounts.filter(a => a.label && a.value).length > 0 ? `
          <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #e2e8f0;">
            ${amounts.filter(a => a.label && a.value).map(a => `
              <div style="margin-bottom: 4px; display: flex; justify-content: space-between;">
                <span style="color: #64748b; font-size: 14px;">${a.label}</span>
                <span style="color: ${brandInfo.primary}; font-size: 14px; font-weight: 700;">${a.value}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${form.attachedDocsList ? `
          <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px; font-style: italic;">${form.attachedDocsList}</p>
          </div>
        ` : ''}
      </div>
    </div>
  ` : '';

  const previewHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 640px; margin: 0 auto; background: #f1f5f9; border-radius: 12px; overflow: hidden;">
      <!-- Colored header -->
      <div style="background: ${brandInfo.primary}; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center;">
        <img src="/brand/${brand === 'consultancy' ? 'saiki-consultancy-white-01' : brand === 'technology' ? 'saiki-technology-white-01' : 'SAIKI-IMAGERY-WHITE-01'}.svg" alt="${brandInfo.label}" style="height: 22px; filter: brightness(0) invert(1);" />
        <span style="color: rgba(255,255,255,0.5); font-size: 10px; letter-spacing: 1px; text-transform: uppercase;">Official Correspondence</span>
      </div>
      <!-- Sub-header -->
      <div style="padding: 14px 32px; background: #fafbfc; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 10px;">
        <img src="/brand/saiki-main-logo-01.svg" alt="SAIKI Group" style="height: 20px;" />
        <span style="width: 1px; height: 14px; background: #e2e8f0; display: inline-block;"></span>
        <span style="color: #94a3b8; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">SAIKI Group</span>
        <span style="margin-left: auto; color: #cbd5e1; font-size: 10px;">${brandInfo.label}</span>
      </div>
      <!-- Body -->
      <div style="background: #ffffff; padding: 32px;">
        <div style="color: #1e293b; font-size: 15px; line-height: 1.75;">${form.emailBody}</div>
        ${refsHtml}
        ${form.closingMessage ? `<div style="color: #1e293b; font-size: 15px; line-height: 1.75; margin-top: 24px;">${form.closingMessage}</div>` : ''}
        <div style="border-top: 1px solid #f0f0f0; padding-top: 24px; margin-top: 28px;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">Sincerely,</p>
          <p style="margin: 6px 0 0;"><strong style="color: ${brandInfo.primary}; font-size: 15px;">SAIKI</strong> <strong style="color: #1e293b; font-size: 15px;">Group</strong></p>
          <p style="margin: 4px 0 0; color: #94a3b8; font-size: 11px;">Beyond Your Needs</p>
          <div style="margin-top: 10px;">
            <a href="https://saiki.id" style="color: ${brandInfo.primary}; font-size: 12px; text-decoration: none; margin-right: 16px;">saiki.id</a>
            <a href="mailto:info@saiki.id" style="color: ${brandInfo.primary}; font-size: 12px; text-decoration: none;">info@saiki.id</a>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div style="background: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #f0f0f0;">
        <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">This email is intended for <strong>${clientName}</strong>. If you received this in error, please notify the sender immediately.</p>
        <p style="color: #cbd5e1; font-size: 10px; margin: 6px 0 0;">&copy; ${new Date().getFullYear()} SAIKI Group | Consultancy, Technology, Imagery</p>
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

          {/* Include receipt selector (when opened from invoice) */}
          {invoice && !receipt && linkedReceipts.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={!!selectedReceiptId}
                  onChange={(e) => setSelectedReceiptId(e.target.checked ? linkedReceipts[0]?.id : null)}
                  className="w-4 h-4 rounded border-green-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-semibold text-green-800">Include Receipt in this email</span>
              </label>
              {selectedReceiptId && (
                <select
                  value={selectedReceiptId}
                  onChange={(e) => setSelectedReceiptId(parseInt(e.target.value))}
                  className={inputCls}
                >
                  {linkedReceipts.map((r) => (
                    <option key={r.id} value={r.id}>{r.number} (Rp{r.amount.toLocaleString('id-ID')})</option>
                  ))}
                </select>
              )}
              <p className="text-xs text-green-600 mt-1">Invoice PDF + Receipt stamped PDF will both be attached.</p>
            </div>
          )}

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
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="Label (e.g. Receipt, Invoice, SPK)" value={ref.label} onChange={(e) => setRefs((prev) => prev.map((r, i) => i === idx ? { ...r, label: e.target.value } : r))} className={`${inputCls} flex-1`} />
                  <input type="color" value={ref.badgeColor} onChange={(e) => setRefs((prev) => prev.map((r, i) => i === idx ? { ...r, badgeColor: e.target.value } : r))} className="w-8 h-8 rounded cursor-pointer border border-gray-200 shrink-0" title="Badge color" />
                  <button type="button" onClick={() => removeRef(idx)} className="text-red-400 hover:text-red-600 shrink-0" title="Remove">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <input type="text" placeholder="Value (e.g. INV215-SC.ITDEV-2025 (30 Dec 2025))" value={ref.value} onChange={(e) => setRefs((prev) => prev.map((r, i) => i === idx ? { ...r, value: e.target.value } : r))} className={inputCls} />
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
