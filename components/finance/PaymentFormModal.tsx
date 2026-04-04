'use client';

import { useState } from 'react';

interface PaymentFormModalProps {
  invoiceId?: number;
  onClose: () => void;
  onSaved: () => void;
}

export default function PaymentFormModal({ invoiceId, onClose, onSaved }: PaymentFormModalProps) {
  const [form, setForm] = useState({
    saikiweb_invoice_id: invoiceId || '',
    saikiweb_amount: 0,
    saikiweb_payment_date: new Date().toISOString().slice(0, 10),
    saikiweb_payment_method: 'Bank transfer',
    saikiweb_status: 'confirmed',
    saikiweb_reference: '',
    saikiweb_notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.saikiweb_invoice_id) { setError('Invoice ID is required'); return; }
    if (form.saikiweb_amount <= 0) { setError('Amount must be greater than 0'); return; }

    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        onSaved();
      } else {
        setError(data.error || 'Failed to record payment');
      }
    } catch {
      setError('Connection error');
    }
    setSaving(false);
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">Record Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Invoice ID</label>
            <input type="number" value={form.saikiweb_invoice_id} onChange={(e) => setForm((f) => ({ ...f, saikiweb_invoice_id: parseInt(e.target.value) || '' }))} className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Amount (IDR)</label>
            <input type="number" min={0} value={form.saikiweb_amount} onChange={(e) => setForm((f) => ({ ...f, saikiweb_amount: parseInt(e.target.value) || 0 }))} className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Payment Date</label>
            <input type="date" value={form.saikiweb_payment_date} onChange={(e) => setForm((f) => ({ ...f, saikiweb_payment_date: e.target.value }))} className={inputCls} required />
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
          <div>
            <label className={labelCls}>Status</label>
            <select value={form.saikiweb_status} onChange={(e) => setForm((f) => ({ ...f, saikiweb_status: e.target.value }))} className={inputCls}>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Reference / Transaction ID</label>
            <input type="text" value={form.saikiweb_reference} onChange={(e) => setForm((f) => ({ ...f, saikiweb_reference: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea value={form.saikiweb_notes} onChange={(e) => setForm((f) => ({ ...f, saikiweb_notes: e.target.value }))} className={inputCls} rows={2} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
