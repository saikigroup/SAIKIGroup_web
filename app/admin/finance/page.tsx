'use client';

import { useState, useEffect } from 'react';
import type { SaikiwebInvoice, SaikiwebReceipt } from '@/lib/supabase';
import InvoiceList from '@/components/finance/InvoiceList';
import InvoiceFormModal from '@/components/finance/InvoiceFormModal';
import InvoiceDetailModal from '@/components/finance/InvoiceDetailModal';
import PaymentTab from '@/components/finance/PaymentTab';
import PaymentFormModal from '@/components/finance/PaymentFormModal';
import ReceiptList from '@/components/finance/ReceiptList';
import ReceiptFormModal from '@/components/finance/ReceiptFormModal';
import ReceiptDetailModal from '@/components/finance/ReceiptDetailModal';
import SendEmailModal from '@/components/finance/SendEmailModal';

type Tab = 'invoices' | 'payments' | 'receipts';
type ModalState =
  | { type: 'none' }
  | { type: 'invoice-form'; invoice?: SaikiwebInvoice }
  | { type: 'invoice-detail'; invoice: SaikiwebInvoice }
  | { type: 'payment-form'; invoiceId?: number }
  | { type: 'receipt-form'; receipt?: SaikiwebReceipt; prefill?: { invoiceId?: number; clientName?: string; clientAddress?: string; amount?: number; serviceBrand?: 'consultancy' | 'technology' | 'imagery' } }
  | { type: 'receipt-detail'; receipt: SaikiwebReceipt }
  | { type: 'send-email'; invoice?: SaikiwebInvoice | null; receipt?: SaikiwebReceipt | null };

export default function FinancePage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('invoices');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        sessionStorage.setItem('admin_pw', password);
      } else {
        setAuthError(data.error || 'Login failed');
      }
    } catch {
      setAuthError('Connection error');
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">SAIKI Admin</h1>
              <p className="text-sm text-gray-500 mt-1">Enter password to continue</p>
            </div>
            <form onSubmit={handleLogin}>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition mb-4" autoFocus />
              {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
              <button type="submit" disabled={authLoading || !password} className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition disabled:opacity-50">
                {authLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'invoices', label: 'Invoices' },
    { key: 'payments', label: 'Payments' },
    { key: 'receipts', label: 'Receipts' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">SAIKI Admin</h1>
            </div>
            <button onClick={() => { sessionStorage.removeItem('admin_pw'); setAuthenticated(false); setPassword(''); }} className="text-sm text-gray-500 hover:text-red-600 transition">Logout</button>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <a href="/admin" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition whitespace-nowrap">Inquiries</a>
            <a href="/admin/articles" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition whitespace-nowrap">Articles</a>
            <a href="/admin/social-posts" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition whitespace-nowrap">Social Posts</a>
            <a href="/admin/seo" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition whitespace-nowrap">SEO</a>
            <a href="/admin/prompt-library" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition whitespace-nowrap">Prompt Library</a>
            <span className="px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg whitespace-nowrap">Finance</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'invoices' && (
          <InvoiceList
            onSelect={(inv) => setModal({ type: 'invoice-detail', invoice: inv })}
            onCreateNew={() => setModal({ type: 'invoice-form' })}
            refreshKey={refreshKey}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentTab
            refreshKey={refreshKey}
            onRecordPayment={() => setModal({ type: 'payment-form' })}
          />
        )}

        {activeTab === 'receipts' && (
          <ReceiptList
            onSelect={(rcp) => setModal({ type: 'receipt-detail', receipt: rcp })}
            onCreateNew={() => setModal({ type: 'receipt-form' })}
            refreshKey={refreshKey}
          />
        )}
      </main>

      {/* Modals */}
      {modal.type === 'invoice-form' && (
        <InvoiceFormModal
          invoice={modal.invoice}
          onClose={() => setModal({ type: 'none' })}
          onSaved={() => { setModal({ type: 'none' }); refresh(); }}
        />
      )}

      {modal.type === 'invoice-detail' && (
        <InvoiceDetailModal
          invoice={modal.invoice}
          onClose={() => setModal({ type: 'none' })}
          onEdit={() => setModal({ type: 'invoice-form', invoice: modal.invoice })}
          onDelete={() => { setModal({ type: 'none' }); refresh(); }}
          onRecordPayment={() => setModal({ type: 'payment-form', invoiceId: modal.invoice.saikiweb_invoice_id })}
          onCreateReceipt={() => setModal({
            type: 'receipt-form',
            prefill: {
              invoiceId: modal.invoice.saikiweb_invoice_id,
              clientName: modal.invoice.saikiweb_client_name,
              clientAddress: modal.invoice.saikiweb_client_address,
              amount: modal.invoice.saikiweb_grand_total,
              serviceBrand: modal.invoice.saikiweb_service_brand,
            },
          })}
          onSendEmail={() => setModal({ type: 'send-email', invoice: modal.invoice, receipt: null })}
        />
      )}

      {modal.type === 'payment-form' && (
        <PaymentFormModal
          invoiceId={modal.invoiceId}
          onClose={() => setModal({ type: 'none' })}
          onSaved={() => { setModal({ type: 'none' }); refresh(); }}
        />
      )}

      {modal.type === 'receipt-form' && (
        <ReceiptFormModal
          receipt={modal.receipt}
          prefill={modal.prefill}
          onClose={() => setModal({ type: 'none' })}
          onSaved={() => { setModal({ type: 'none' }); refresh(); }}
        />
      )}

      {modal.type === 'receipt-detail' && (
        <ReceiptDetailModal
          receipt={modal.receipt}
          onClose={() => setModal({ type: 'none' })}
          onEdit={() => setModal({ type: 'receipt-form', receipt: modal.receipt })}
          onSendEmail={() => setModal({ type: 'send-email', invoice: null, receipt: modal.receipt })}
        />
      )}

      {modal.type === 'send-email' && (
        <SendEmailModal
          invoice={modal.invoice}
          receipt={modal.receipt}
          onClose={() => setModal({ type: 'none' })}
          onSent={() => { setModal({ type: 'none' }); refresh(); }}
        />
      )}
    </div>
  );
}
