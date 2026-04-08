'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SaikiwebDocument } from '@/lib/supabase';
import { SERVICE_BRANDS, DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from '@/lib/finance';
import DocumentFormModal from '@/components/documents/DocumentFormModal';
import DocumentDetailModal from '@/components/documents/DocumentDetailModal';
import PdfStampModal from '@/components/documents/PdfStampModal';

type ModalState =
  | { type: 'none' }
  | { type: 'form'; document?: SaikiwebDocument }
  | { type: 'detail'; document: SaikiwebDocument }
  | { type: 'stamp'; document: SaikiwebDocument };

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function DocumentsPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [documents, setDocuments] = useState<SaikiwebDocument[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

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

  const fetchDocuments = useCallback(async (page = 1) => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (brandFilter !== 'all') params.set('brand', brandFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/documents?${params}`, {
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data);
        setPagination(data.pagination);
      } else if (res.status === 401) {
        setAuthenticated(false);
        sessionStorage.removeItem('admin_pw');
      }
    } catch {
      console.error('Failed to fetch documents');
    }
    setLoading(false);
  }, [statusFilter, brandFilter, typeFilter, search]);

  useEffect(() => {
    if (authenticated) fetchDocuments();
  }, [authenticated, statusFilter, brandFilter, typeFilter, search, fetchDocuments]);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  const refresh = () => fetchDocuments(pagination.page);

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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

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
            <a href="/admin/finance" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition whitespace-nowrap">Finance</a>
            <span className="px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg whitespace-nowrap">Documents</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }}>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search document name, number, or recipient..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSearch(searchInput); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm"
                />
                {search && (
                  <button onClick={() => { setSearch(''); setSearchInput(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            </form>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none">
            <option value="all">All Status</option>
            {Object.entries(DOCUMENT_STATUS_LABELS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none">
            <option value="all">All Brands</option>
            {Object.entries(SERVICE_BRANDS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none">
            <option value="all">All Types</option>
            {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button
            onClick={() => setModal({ type: 'form' })}
            className="px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Document
          </button>
        </div>

        {/* Document List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && documents.length === 0 ? (
            <div className="p-16 text-center text-gray-500">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="p-16 text-center text-gray-500">No documents found.</div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {documents.map((doc) => {
                  const st = DOCUMENT_STATUS_LABELS[doc.saikiweb_status] || DOCUMENT_STATUS_LABELS.active;
                  const brand = SERVICE_BRANDS[doc.saikiweb_service_brand];
                  return (
                    <div key={doc.saikiweb_document_id} className="px-4 py-4 hover:bg-gray-50/50 transition">
                      <button onClick={() => setModal({ type: 'detail', document: doc })} className="w-full text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                          <span className="text-xs text-gray-400">{formatDate(doc.saikiweb_document_date)}</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{doc.saikiweb_document_name}</div>
                        <div className="text-xs text-gray-500 font-mono">{doc.saikiweb_document_number}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: brand.bgColor, color: brand.color }}>{brand.label}</span>
                          <span className="text-xs text-gray-400">{DOCUMENT_TYPE_LABELS[doc.saikiweb_document_type]}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">To: {doc.saikiweb_issued_to}</div>
                      </button>
                      {doc.saikiweb_original_file_url && !doc.saikiweb_stamped_file_url && (
                        <button onClick={() => setModal({ type: 'stamp', document: doc })} className="mt-2 inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          Stamp QR
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Document</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Brand</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Issued To</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">QR</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {documents.map((doc) => {
                      const st = DOCUMENT_STATUS_LABELS[doc.saikiweb_status] || DOCUMENT_STATUS_LABELS.active;
                      const brand = SERVICE_BRANDS[doc.saikiweb_service_brand];
                      return (
                        <tr key={doc.saikiweb_document_id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(doc.saikiweb_document_date)}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{doc.saikiweb_document_name}</div>
                            <div className="text-xs text-gray-500 font-mono">{doc.saikiweb_document_number}</div>
                            <div className="text-xs text-gray-400">{DOCUMENT_TYPE_LABELS[doc.saikiweb_document_type]}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: brand.bgColor, color: brand.color }}>{brand.label}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{doc.saikiweb_issued_to}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                          </td>
                          <td className="px-6 py-4">
                            {doc.saikiweb_stamped_file_url ? (
                              <a href={doc.saikiweb_stamped_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Stamped
                              </a>
                            ) : doc.saikiweb_original_file_url ? (
                              <button onClick={() => setModal({ type: 'stamp', document: doc })} className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-full">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Stamp QR
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">No file</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => setModal({ type: 'detail', document: doc })} className="text-sm text-teal-600 hover:text-teal-800 font-medium">Detail</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages} ({pagination.total} results)</p>
              <div className="flex gap-2">
                <button onClick={() => fetchDocuments(pagination.page - 1)} disabled={pagination.page <= 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition">Previous</button>
                <button onClick={() => fetchDocuments(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition">Next</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {modal.type === 'form' && (
        <DocumentFormModal
          document={modal.document}
          onClose={() => setModal({ type: 'none' })}
          onSaved={() => { setModal({ type: 'none' }); refresh(); }}
        />
      )}

      {modal.type === 'detail' && (
        <DocumentDetailModal
          document={modal.document}
          onClose={() => setModal({ type: 'none' })}
          onEdit={() => setModal({ type: 'form', document: modal.document })}
          onDelete={() => { setModal({ type: 'none' }); refresh(); }}
          onStamp={() => setModal({ type: 'stamp', document: modal.document })}
          onRefresh={(updatedDoc) => {
            setModal({ type: 'detail', document: updatedDoc });
            refresh();
          }}
        />
      )}

      {modal.type === 'stamp' && (
        <PdfStampModal
          document={modal.document}
          onClose={() => setModal({ type: 'none' })}
          onStamped={(updatedDoc) => {
            setModal({ type: 'detail', document: updatedDoc });
            refresh();
          }}
        />
      )}
    </div>
  );
}
