'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '@/lib/finance';
import type { SaikiwebPayment, PaymentStatus } from '@/lib/supabase';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const paymentStatusStyles: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
};

interface PaymentTabProps {
  refreshKey: number;
  onRecordPayment: () => void;
}

export default function PaymentTab({ refreshKey, onRecordPayment }: PaymentTabProps) {
  const [payments, setPayments] = useState<SaikiwebPayment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  const fetchPayments = useCallback(async (page = 1) => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?page=${page}&limit=20`, {
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
        setPagination(data.pagination);
      }
    } catch {
      console.error('Failed to fetch payments');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments, refreshKey]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Payment History</h3>
        <button onClick={onRecordPayment} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Record Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && payments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No payments recorded yet.</div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {payments.map((p) => {
                const st = paymentStatusStyles[p.saikiweb_status];
                return (
                  <div key={p.saikiweb_payment_id} className="px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">INV #{p.saikiweb_invoice_id}</span>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{formatCurrency(p.saikiweb_amount)}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{p.saikiweb_payment_method}</span>
                      <span className="text-xs text-gray-400">{formatDate(p.saikiweb_payment_date)}</span>
                    </div>
                    {p.saikiweb_reference && <div className="text-xs text-gray-400 mt-1">Ref: {p.saikiweb_reference}</div>}
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Invoice</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Amount</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Method</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Reference</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((p) => {
                    const st = paymentStatusStyles[p.saikiweb_status];
                    return (
                      <tr key={p.saikiweb_payment_id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(p.saikiweb_payment_date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">INV #{p.saikiweb_invoice_id}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{formatCurrency(p.saikiweb_amount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.saikiweb_payment_method}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{p.saikiweb_reference || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{p.saikiweb_notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => fetchPayments(pagination.page - 1)} disabled={pagination.page <= 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition">Previous</button>
              <button onClick={() => fetchPayments(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
