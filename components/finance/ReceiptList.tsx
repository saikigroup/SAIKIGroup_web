'use client';

import { useState, useEffect, useCallback } from 'react';
import { SERVICE_BRANDS, formatCurrency } from '@/lib/finance';
import type { SaikiwebReceipt, ServiceBrand } from '@/lib/supabase';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ReceiptListProps {
  onSelect: (receipt: SaikiwebReceipt) => void;
  onCreateNew: () => void;
  refreshKey: number;
}

export default function ReceiptList({ onSelect, onCreateNew, refreshKey }: ReceiptListProps) {
  const [receipts, setReceipts] = useState<SaikiwebReceipt[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchReceipts = useCallback(async (page = 1) => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/receipts?${params}`, {
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) {
        setReceipts(data.data);
        setPagination(data.pagination);
      }
    } catch {
      console.error('Failed to fetch receipts');
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts, refreshKey]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search receipts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') setSearch(searchInput); }}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm"
              />
              {search && (
                <button onClick={() => { setSearch(''); setSearchInput(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </form>
        </div>
        <button onClick={onCreateNew} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition flex items-center gap-2 whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Receipt
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && receipts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading receipts...</div>
        ) : receipts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No receipts found.</div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {receipts.map((rcp) => {
                const brandInfo = SERVICE_BRANDS[rcp.saikiweb_service_brand as ServiceBrand];
                return (
                  <button key={rcp.saikiweb_receipt_id} onClick={() => onSelect(rcp)} className="w-full text-left px-4 py-4 hover:bg-gray-50/50 transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-gray-500">{rcp.saikiweb_receipt_number}</span>
                      <span className="text-xs" style={{ color: brandInfo?.color }}>{brandInfo?.label}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{rcp.saikiweb_client_name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{formatDate(rcp.saikiweb_receipt_date)}</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(rcp.saikiweb_amount, rcp.saikiweb_currency)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Receipt #</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Client</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Service</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Amount</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Payment For</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {receipts.map((rcp) => {
                    const brandInfo = SERVICE_BRANDS[rcp.saikiweb_service_brand as ServiceBrand];
                    return (
                      <tr key={rcp.saikiweb_receipt_id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 text-sm font-mono text-gray-700">{rcp.saikiweb_receipt_number}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{rcp.saikiweb_client_name}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: brandInfo?.color + '15', color: brandInfo?.color }}>{brandInfo?.label}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(rcp.saikiweb_receipt_date)}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{formatCurrency(rcp.saikiweb_amount, rcp.saikiweb_currency)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{rcp.saikiweb_payment_for}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => onSelect(rcp)} className="text-sm text-teal-600 hover:text-teal-800 font-medium">Detail</button>
                        </td>
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
              <button onClick={() => fetchReceipts(pagination.page - 1)} disabled={pagination.page <= 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition">Previous</button>
              <button onClick={() => fetchReceipts(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
