'use client';

import { useState, useEffect, useCallback } from 'react';
import { SERVICE_BRANDS, formatCurrency } from '@/lib/finance';
import type { SaikiwebInvoice, ServiceBrand, InvoiceStatus } from '@/lib/supabase';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusStyles: Record<InvoiceStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  partial: { label: 'Partial', color: 'bg-amber-100 text-amber-700' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-200 text-gray-500' },
};

interface InvoiceListProps {
  onSelect: (invoice: SaikiwebInvoice) => void;
  onCreateNew: () => void;
  refreshKey: number;
}

export default function InvoiceList({ onSelect, onCreateNew, refreshKey }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<SaikiwebInvoice[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchInvoices = useCallback(async (page = 1) => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (brandFilter !== 'all') params.set('brand', brandFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/invoices?${params}`, {
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data);
        setPagination(data.pagination);
      }
    } catch {
      console.error('Failed to fetch invoices');
    }
    setLoading(false);
  }, [statusFilter, brandFilter, search]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices, refreshKey]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search invoices..."
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
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none">
          <option value="all">All Status</option>
          {Object.entries(statusStyles).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none">
          <option value="all">All Services</option>
          {Object.entries(SERVICE_BRANDS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button onClick={onCreateNew} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition flex items-center gap-2 whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Invoice
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && invoices.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No invoices found.</div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {invoices.map((inv) => {
                const st = statusStyles[inv.saikiweb_status] || statusStyles.draft;
                const brandInfo = SERVICE_BRANDS[inv.saikiweb_service_brand as ServiceBrand];
                return (
                  <button key={inv.saikiweb_invoice_id} onClick={() => onSelect(inv)} className="w-full text-left px-4 py-4 hover:bg-gray-50/50 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-500">{inv.saikiweb_invoice_number}</span>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{inv.saikiweb_client_name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs" style={{ color: brandInfo?.color }}>{brandInfo?.label}</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(inv.saikiweb_grand_total, inv.saikiweb_currency)}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{formatDate(inv.saikiweb_issued_date)}</div>
                  </button>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Invoice #</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Client</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Service</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Amount</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => {
                    const st = statusStyles[inv.saikiweb_status] || statusStyles.draft;
                    const brandInfo = SERVICE_BRANDS[inv.saikiweb_service_brand as ServiceBrand];
                    return (
                      <tr key={inv.saikiweb_invoice_id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 text-sm font-mono text-gray-700">{inv.saikiweb_invoice_number}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{inv.saikiweb_client_name}</div>
                          {inv.saikiweb_client_email && <div className="text-xs text-gray-500">{inv.saikiweb_client_email}</div>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: brandInfo?.color + '15', color: brandInfo?.color }}>
                            {brandInfo?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(inv.saikiweb_issued_date)}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{formatCurrency(inv.saikiweb_grand_total, inv.saikiweb_currency)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => onSelect(inv)} className="text-sm text-teal-600 hover:text-teal-800 font-medium">Detail</button>
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
            <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages} ({pagination.total} results)</p>
            <div className="flex gap-2">
              <button onClick={() => fetchInvoices(pagination.page - 1)} disabled={pagination.page <= 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition">Previous</button>
              <button onClick={() => fetchInvoices(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
