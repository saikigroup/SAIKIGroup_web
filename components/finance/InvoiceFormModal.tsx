'use client';

import { useState, useEffect } from 'react';
import { SERVICE_BRANDS, generateInvoiceNumber } from '@/lib/finance';
import type { SaikiwebInvoice, ServiceBrand } from '@/lib/supabase';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface CustomField {
  key: string;
  value: string;
}

interface InvoiceFormModalProps {
  invoice?: SaikiwebInvoice | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function InvoiceFormModal({ invoice, onClose, onSaved }: InvoiceFormModalProps) {
  const isEdit = !!invoice;

  const [form, setForm] = useState({
    saikiweb_invoice_number: invoice?.saikiweb_invoice_number || generateInvoiceNumber('consultancy'),
    saikiweb_service_brand: (invoice?.saikiweb_service_brand || 'consultancy') as ServiceBrand,
    saikiweb_status: invoice?.saikiweb_status || 'draft',
    saikiweb_client_name: invoice?.saikiweb_client_name || '',
    saikiweb_client_address: invoice?.saikiweb_client_address || '',
    saikiweb_client_email: invoice?.saikiweb_client_email || '',
    saikiweb_client_phone: invoice?.saikiweb_client_phone || '',
    saikiweb_issued_date: invoice?.saikiweb_issued_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    saikiweb_due_date: invoice?.saikiweb_due_date?.slice(0, 10) || '',
    saikiweb_currency: invoice?.saikiweb_currency || 'IDR',
    saikiweb_tax_percent: invoice?.saikiweb_tax_percent || 0,
    saikiweb_discount_amount: invoice?.saikiweb_discount_amount || 0,
    saikiweb_notes: invoice?.saikiweb_notes || '',
    saikiweb_payment_bank: invoice?.saikiweb_payment_bank || 'Bank Central Asia',
    saikiweb_payment_account: invoice?.saikiweb_payment_account || '',
    saikiweb_payment_recipient: invoice?.saikiweb_payment_recipient || '',
    saikiweb_signer_name: invoice?.saikiweb_signer_name || '',
    saikiweb_signer_title: invoice?.saikiweb_signer_title || '',
    saikiweb_is_legacy: invoice?.saikiweb_is_legacy || false,
    saikiweb_legacy_notes: invoice?.saikiweb_legacy_notes || '',
    saikiweb_related_invoice_id: invoice?.saikiweb_related_invoice_id || '',
  });

  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unit_price: 0 }]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load items if editing
  useEffect(() => {
    if (isEdit && invoice?.saikiweb_invoice_id) {
      const pw = sessionStorage.getItem('admin_pw');
      if (!pw) return;
      fetch(`/api/admin/invoices/items?invoice_id=${invoice.saikiweb_invoice_id}`, {
        headers: { 'x-admin-password': pw },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.data.length > 0) {
            setItems(data.data.map((it: Record<string, unknown>) => ({
              description: it.saikiweb_description as string,
              quantity: it.saikiweb_quantity as number,
              unit_price: it.saikiweb_unit_price as number,
            })));
          }
        })
        .catch(() => {});

      // Load custom fields
      if (invoice.saikiweb_custom_fields) {
        setCustomFields(
          Object.entries(invoice.saikiweb_custom_fields).map(([key, value]) => ({ key, value }))
        );
      }
    }
  }, [isEdit, invoice]);

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems((prev) => [...prev, { description: '', quantity: 1, unit_price: 0 }]);
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const addCustomField = () => setCustomFields((prev) => [...prev, { key: '', value: '' }]);
  const removeCustomField = (idx: number) => setCustomFields((prev) => prev.filter((_, i) => i !== idx));

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0);
  const taxAmount = form.saikiweb_tax_percent ? subtotal * (form.saikiweb_tax_percent / 100) : 0;
  const grandTotal = subtotal + taxAmount - (form.saikiweb_discount_amount || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    // Build custom fields object
    const cfObj: Record<string, string> = {};
    customFields.forEach((cf) => { if (cf.key.trim()) cfObj[cf.key.trim()] = cf.value; });

    const payload = {
      ...form,
      saikiweb_custom_fields: Object.keys(cfObj).length > 0 ? cfObj : null,
      saikiweb_related_invoice_id: form.saikiweb_related_invoice_id || null,
      saikiweb_legacy_notes: form.saikiweb_legacy_notes || null,
      items: items.filter((it) => it.description.trim()),
      ...(isEdit ? { saikiweb_invoice_id: invoice?.saikiweb_invoice_id } : {}),
    };

    try {
      const res = await fetch('/api/admin/invoices', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onSaved();
      } else {
        setError(data.error || 'Failed to save invoice');
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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Invoice' : 'New Invoice'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Invoice Number</label>
              <input type="text" value={form.saikiweb_invoice_number} onChange={(e) => setForm((f) => ({ ...f, saikiweb_invoice_number: e.target.value }))} className={inputCls} required />
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
              <label className={labelCls}>Status</label>
              <select value={form.saikiweb_status} onChange={(e) => setForm((f) => ({ ...f, saikiweb_status: e.target.value as import('@/lib/supabase').InvoiceStatus }))} className={inputCls}>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Legacy / Historical Data Toggle */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.saikiweb_is_legacy}
                onChange={(e) => setForm((f) => ({ ...f, saikiweb_is_legacy: e.target.checked }))}
                className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-sm font-semibold text-amber-800">Historical / Legacy Data</span>
                <p className="text-xs text-amber-600">Centang jika invoice ini dibuat sebelum sistem ini (misal: tahun 2025)</p>
              </div>
            </label>
            {form.saikiweb_is_legacy && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className={labelCls}>Catatan Legacy</label>
                  <textarea
                    value={form.saikiweb_legacy_notes}
                    onChange={(e) => setForm((f) => ({ ...f, saikiweb_legacy_notes: e.target.value }))}
                    className={inputCls}
                    rows={2}
                    placeholder="Contoh: Invoice asli dikirim manual via email pada 30 Des 2025"
                  />
                </div>
                <div>
                  <label className={labelCls}>Related Invoice ID (jika ini pelunasan dari invoice sebelumnya)</label>
                  <input
                    type="number"
                    value={form.saikiweb_related_invoice_id}
                    onChange={(e) => setForm((f) => ({ ...f, saikiweb_related_invoice_id: parseInt(e.target.value) || '' }))}
                    className={inputCls}
                    placeholder="ID invoice DP/sebelumnya"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Client Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Client Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Client Name</label>
                <input type="text" value={form.saikiweb_client_name} onChange={(e) => setForm((f) => ({ ...f, saikiweb_client_name: e.target.value }))} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={form.saikiweb_client_email} onChange={(e) => setForm((f) => ({ ...f, saikiweb_client_email: e.target.value }))} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <textarea value={form.saikiweb_client_address} onChange={(e) => setForm((f) => ({ ...f, saikiweb_client_address: e.target.value }))} className={inputCls} rows={2} required />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input type="text" value={form.saikiweb_client_phone} onChange={(e) => setForm((f) => ({ ...f, saikiweb_client_phone: e.target.value }))} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Issued Date</label>
              <input type="date" value={form.saikiweb_issued_date} onChange={(e) => setForm((f) => ({ ...f, saikiweb_issued_date: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Due Date</label>
              <input type="date" value={form.saikiweb_due_date} onChange={(e) => setForm((f) => ({ ...f, saikiweb_due_date: e.target.value }))} className={inputCls} />
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

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Line Items</h3>
              <button type="button" onClick={addItem} className="text-xs text-teal-600 hover:text-teal-700 font-medium">+ Add Item</button>
            </div>
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="flex-1">
                  <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} className={inputCls} />
                </div>
                <div className="w-20">
                  <input type="number" placeholder="Qty" min={1} value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)} className={inputCls} />
                </div>
                <div className="w-36">
                  <input type="number" placeholder="Unit price" min={0} value={item.unit_price} onChange={(e) => updateItem(idx, 'unit_price', parseInt(e.target.value) || 0)} className={inputCls} />
                </div>
                <div className="w-28 text-right pt-2 text-sm font-medium text-gray-700">
                  {(item.quantity * item.unit_price).toLocaleString('id-ID')}
                </div>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(idx)} className="pt-2 text-red-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-sm gap-2">
                <span className="text-gray-600">Tax (%)</span>
                <input type="number" min={0} max={100} value={form.saikiweb_tax_percent} onChange={(e) => setForm((f) => ({ ...f, saikiweb_tax_percent: parseFloat(e.target.value) || 0 }))} className="w-20 px-2 py-1 rounded border border-gray-200 text-sm text-right" />
                <span className="font-medium w-24 text-right">{taxAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-sm gap-2">
                <span className="text-gray-600">Discount</span>
                <input type="number" min={0} value={form.saikiweb_discount_amount} onChange={(e) => setForm((f) => ({ ...f, saikiweb_discount_amount: parseInt(e.target.value) || 0 }))} className="w-32 px-2 py-1 rounded border border-gray-200 text-sm text-right" />
              </div>
              <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                <span>Grand Total</span>
                <span>{form.saikiweb_currency} {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Payment Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Bank Name</label>
                <input type="text" value={form.saikiweb_payment_bank} onChange={(e) => setForm((f) => ({ ...f, saikiweb_payment_bank: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Account Number</label>
                <input type="text" value={form.saikiweb_payment_account} onChange={(e) => setForm((f) => ({ ...f, saikiweb_payment_account: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Recipient Name</label>
                <input type="text" value={form.saikiweb_payment_recipient} onChange={(e) => setForm((f) => ({ ...f, saikiweb_payment_recipient: e.target.value }))} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Signer */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Signature</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Signer Name</label>
                <input type="text" value={form.saikiweb_signer_name} onChange={(e) => setForm((f) => ({ ...f, saikiweb_signer_name: e.target.value }))} className={inputCls} placeholder="e.g. Dimas Budi Ramadhan" />
              </div>
              <div>
                <label className={labelCls}>Signer Title / Position</label>
                <input type="text" value={form.saikiweb_signer_title} onChange={(e) => setForm((f) => ({ ...f, saikiweb_signer_title: e.target.value }))} className={inputCls} placeholder="e.g. Managing Director" />
              </div>
            </div>
            {form.saikiweb_signer_name && (
              <div className="pt-2 text-center">
                <span style={{ fontFamily: "'Bastliga One', cursive", fontSize: '22px', color: '#1a1a2e' }}>{form.saikiweb_signer_name}</span>
                {form.saikiweb_signer_title && <p className="text-[10px] text-gray-400 mt-0.5">{form.saikiweb_signer_title}</p>}
              </div>
            )}
          </div>

          {/* Custom Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Custom Fields</h3>
              <button type="button" onClick={addCustomField} className="text-xs text-teal-600 hover:text-teal-700 font-medium">+ Add Field</button>
            </div>
            {customFields.map((cf, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="text" placeholder="Field name" value={cf.key} onChange={(e) => setCustomFields((prev) => prev.map((f, i) => i === idx ? { ...f, key: e.target.value } : f))} className={`${inputCls} flex-1`} />
                <input type="text" placeholder="Value" value={cf.value} onChange={(e) => setCustomFields((prev) => prev.map((f, i) => i === idx ? { ...f, value: e.target.value } : f))} className={`${inputCls} flex-1`} />
                <button type="button" onClick={() => removeCustomField(idx)} className="text-red-400 hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea value={form.saikiweb_notes} onChange={(e) => setForm((f) => ({ ...f, saikiweb_notes: e.target.value }))} className={inputCls} rows={2} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
