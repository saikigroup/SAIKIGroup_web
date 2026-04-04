'use client';

import { useState } from 'react';
import { SERVICE_BRANDS, generateReceiptNumber, numberToWords } from '@/lib/finance';
import type { SaikiwebReceipt, ServiceBrand } from '@/lib/supabase';

interface CustomField {
  key: string;
  value: string;
}

interface ReceiptFormModalProps {
  receipt?: SaikiwebReceipt | null;
  prefill?: {
    invoiceId?: number;
    clientName?: string;
    clientAddress?: string;
    amount?: number;
    serviceBrand?: ServiceBrand;
  };
  onClose: () => void;
  onSaved: () => void;
}

export default function ReceiptFormModal({ receipt, prefill, onClose, onSaved }: ReceiptFormModalProps) {
  const isEdit = !!receipt;

  const [form, setForm] = useState({
    saikiweb_receipt_number: receipt?.saikiweb_receipt_number || generateReceiptNumber(prefill?.serviceBrand || 'consultancy'),
    saikiweb_service_brand: (receipt?.saikiweb_service_brand || prefill?.serviceBrand || 'consultancy') as ServiceBrand,
    saikiweb_invoice_id: receipt?.saikiweb_invoice_id || prefill?.invoiceId || '',
    saikiweb_client_name: receipt?.saikiweb_client_name || prefill?.clientName || '',
    saikiweb_client_address: receipt?.saikiweb_client_address || prefill?.clientAddress || '',
    saikiweb_amount: receipt?.saikiweb_amount || prefill?.amount || 0,
    saikiweb_amount_words: receipt?.saikiweb_amount_words || '',
    saikiweb_currency: receipt?.saikiweb_currency || 'IDR',
    saikiweb_payment_for: receipt?.saikiweb_payment_for || '',
    saikiweb_package_value: receipt?.saikiweb_package_value || 0,
    saikiweb_reference: receipt?.saikiweb_reference || '',
    saikiweb_payment_method: receipt?.saikiweb_payment_method || 'Bank transfer',
    saikiweb_receipt_date: receipt?.saikiweb_receipt_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    saikiweb_signer_name: receipt?.saikiweb_signer_name || '',
  });

  const [customFields, setCustomFields] = useState<CustomField[]>(
    receipt?.saikiweb_custom_fields
      ? Object.entries(receipt.saikiweb_custom_fields).map(([key, value]) => ({ key, value }))
      : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const autoGenerateWords = () => {
    if (form.saikiweb_amount > 0) {
      setForm((f) => ({ ...f, saikiweb_amount_words: numberToWords(f.saikiweb_amount) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    setSaving(true);
    setError('');

    const cfObj: Record<string, string> = {};
    customFields.forEach((cf) => { if (cf.key.trim()) cfObj[cf.key.trim()] = cf.value; });

    const payload = {
      ...form,
      saikiweb_invoice_id: form.saikiweb_invoice_id || null,
      saikiweb_package_value: form.saikiweb_package_value || null,
      saikiweb_custom_fields: Object.keys(cfObj).length > 0 ? cfObj : null,
      ...(isEdit ? { saikiweb_receipt_id: receipt?.saikiweb_receipt_id } : {}),
    };

    try {
      const res = await fetch('/api/admin/receipts', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onSaved();
      } else {
        setError(data.error || 'Failed to save receipt');
      }
    } catch {
      setError('Connection error');
    }
    setSaving(false);
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Receipt' : 'New Receipt'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Receipt Number</label>
              <input type="text" value={form.saikiweb_receipt_number} onChange={(e) => setForm((f) => ({ ...f, saikiweb_receipt_number: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Service Brand</label>
              <select value={form.saikiweb_service_brand} onChange={(e) => setForm((f) => ({ ...f, saikiweb_service_brand: e.target.value as ServiceBrand }))} className={inputCls}>
                {Object.entries(SERVICE_BRANDS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Receipt Date</label>
              <input type="date" value={form.saikiweb_receipt_date} onChange={(e) => setForm((f) => ({ ...f, saikiweb_receipt_date: e.target.value }))} className={inputCls} required />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Client Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Client Name</label>
                <input type="text" value={form.saikiweb_client_name} onChange={(e) => setForm((f) => ({ ...f, saikiweb_client_name: e.target.value }))} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Invoice ID (optional)</label>
                <input type="number" value={form.saikiweb_invoice_id} onChange={(e) => setForm((f) => ({ ...f, saikiweb_invoice_id: parseInt(e.target.value) || '' }))} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <textarea value={form.saikiweb_client_address} onChange={(e) => setForm((f) => ({ ...f, saikiweb_client_address: e.target.value }))} className={inputCls} rows={2} required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Amount</label>
              <input type="number" min={0} value={form.saikiweb_amount} onChange={(e) => setForm((f) => ({ ...f, saikiweb_amount: parseInt(e.target.value) || 0 }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <select value={form.saikiweb_currency} onChange={(e) => setForm((f) => ({ ...f, saikiweb_currency: e.target.value }))} className={inputCls}>
                <option value="IDR">IDR</option>
                <option value="USD">USD</option>
                <option value="SGD">SGD</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls}>Amount in Words</label>
              <button type="button" onClick={autoGenerateWords} className="text-xs text-teal-600 hover:text-teal-700 font-medium mb-1">Auto-generate</button>
            </div>
            <input type="text" value={form.saikiweb_amount_words} onChange={(e) => setForm((f) => ({ ...f, saikiweb_amount_words: e.target.value }))} className={inputCls} required />
          </div>

          <div>
            <label className={labelCls}>Payment For</label>
            <textarea value={form.saikiweb_payment_for} onChange={(e) => setForm((f) => ({ ...f, saikiweb_payment_for: e.target.value }))} className={inputCls} rows={2} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Package Value (optional)</label>
              <input type="number" min={0} value={form.saikiweb_package_value} onChange={(e) => setForm((f) => ({ ...f, saikiweb_package_value: parseInt(e.target.value) || 0 }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Reference</label>
              <input type="text" value={form.saikiweb_reference} onChange={(e) => setForm((f) => ({ ...f, saikiweb_reference: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Payment Method</label>
              <select value={form.saikiweb_payment_method} onChange={(e) => setForm((f) => ({ ...f, saikiweb_payment_method: e.target.value }))} className={inputCls}>
                <option value="Bank transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="E-wallet">E-Wallet</option>
                <option value="Credit card">Credit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Signer */}
          <div>
            <label className={labelCls}>Signer Name (for signature)</label>
            <div className="flex items-center gap-3">
              <input type="text" value={form.saikiweb_signer_name} onChange={(e) => setForm((f) => ({ ...f, saikiweb_signer_name: e.target.value }))} className={`${inputCls} flex-1`} placeholder="e.g. Dimas Budi Ramadhan" />
              {form.saikiweb_signer_name && (
                <span style={{ fontFamily: "'Bastliga One', cursive", fontSize: '22px', color: '#1a1a2e' }}>{form.saikiweb_signer_name}</span>
              )}
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Custom Fields</h3>
              <button type="button" onClick={() => setCustomFields((prev) => [...prev, { key: '', value: '' }])} className="text-xs text-teal-600 hover:text-teal-700 font-medium">+ Add Field</button>
            </div>
            {customFields.map((cf, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" placeholder="Field name" value={cf.key} onChange={(e) => setCustomFields((prev) => prev.map((f, i) => i === idx ? { ...f, key: e.target.value } : f))} className={`${inputCls} flex-1`} />
                <input type="text" placeholder="Value" value={cf.value} onChange={(e) => setCustomFields((prev) => prev.map((f, i) => i === idx ? { ...f, value: e.target.value } : f))} className={`${inputCls} flex-1`} />
                <button type="button" onClick={() => setCustomFields((prev) => prev.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Receipt' : 'Create Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
