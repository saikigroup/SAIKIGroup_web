'use client';

import { useState, useEffect, useCallback } from 'react';

interface Inquiry {
  saikiweb_inquiry_id: number;
  saikiweb_name: string;
  saikiweb_email: string;
  saikiweb_phone: string | null;
  saikiweb_company: string | null;
  saikiweb_category: string;
  saikiweb_message: string;
  saikiweb_budget: string | null;
  saikiweb_locale: string;
  saikiweb_created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  general: { label: 'Umum', color: 'bg-gray-100 text-gray-700' },
  consultancy: { label: 'Consultancy', color: 'bg-blue-100 text-blue-700' },
  imagery: { label: 'Imagery', color: 'bg-purple-100 text-purple-700' },
  technology: { label: 'Technology', color: 'bg-teal-100 text-teal-700' },
  partnership: { label: 'Partnership', color: 'bg-amber-100 text-amber-700' },
  career: { label: 'Career', color: 'bg-green-100 text-green-700' },
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [emailTest, setEmailTest] = useState<{ loading: boolean; result: Record<string, unknown> | null }>({ loading: false, result: null });

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

  const fetchInquiries = useCallback(async (page = 1) => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (category !== 'all') params.set('category', category);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/inquiries?${params}`, {
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
        setPagination(data.pagination);
      } else if (res.status === 401) {
        setAuthenticated(false);
        sessionStorage.removeItem('admin_pw');
      }
    } catch {
      console.error('Failed to fetch inquiries');
    }
    setLoading(false);
  }, [category, search]);

  useEffect(() => {
    if (authenticated) fetchInquiries();
  }, [authenticated, category, search, fetchInquiries]);

  // Check saved session
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition mb-4"
                autoFocus
              />
              {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
              <button
                type="submit"
                disabled={authLoading || !password}
                className="w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
              >
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
    return d.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">SAIKI Admin</h1>
            </div>
            <nav className="flex items-center gap-1">
              <span className="px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg">
                Inquiries
              </span>
              <a
                href="/admin/articles"
                className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                Articles
              </a>
              <a
                href="/admin/prompt-library"
                className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                Prompt Library
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">
              {pagination.total} total inquiries
            </span>
            <button
              onClick={async () => {
                const pw = sessionStorage.getItem('admin_pw');
                if (!pw) return;
                setEmailTest({ loading: true, result: null });
                try {
                  const res = await fetch('/api/admin/test-email', {
                    method: 'POST',
                    headers: { 'x-admin-password': pw },
                  });
                  const data = await res.json();
                  setEmailTest({ loading: false, result: data });
                } catch (err) {
                  setEmailTest({ loading: false, result: { error: String(err) } });
                }
              }}
              disabled={emailTest.loading}
              className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 font-medium rounded-lg hover:bg-amber-200 transition disabled:opacity-50"
            >
              {emailTest.loading ? 'Testing...' : 'Test Email'}
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('admin_pw');
                setAuthenticated(false);
                setPassword('');
              }}
              className="text-sm text-gray-500 hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }}>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, company, or message..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSearch(searchInput); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setSearchInput(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryLabels).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button
            onClick={() => fetchInquiries(pagination.page)}
            className="px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition flex items-center gap-2"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && inquiries.length === 0 ? (
            <div className="p-16 text-center text-gray-500">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="p-16 text-center text-gray-500">No inquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Name</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Email</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Category</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Message</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inquiries.map((inq) => {
                    const cat = categoryLabels[inq.saikiweb_category] || { label: inq.saikiweb_category, color: 'bg-gray-100 text-gray-700' };
                    return (
                      <tr key={inq.saikiweb_inquiry_id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(inq.saikiweb_created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{inq.saikiweb_name}</div>
                          {inq.saikiweb_company && (
                            <div className="text-xs text-gray-500">{inq.saikiweb_company}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <a href={`mailto:${inq.saikiweb_email}`} className="text-sm text-teal-600 hover:underline">
                            {inq.saikiweb_email}
                          </a>
                          {inq.saikiweb_phone && (
                            <div className="text-xs text-gray-500">{inq.saikiweb_phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${cat.color}`}>
                            {cat.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {inq.saikiweb_message}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} results)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchInquiries(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchInquiries(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedInquiry(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Inquiry Detail</h2>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="font-medium text-gray-900">{selectedInquiry.saikiweb_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${selectedInquiry.saikiweb_email}`} className="text-teal-600 hover:underline font-medium">
                    {selectedInquiry.saikiweb_email}
                  </a>
                </div>
                {selectedInquiry.saikiweb_phone && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <a href={`tel:${selectedInquiry.saikiweb_phone}`} className="text-gray-900">{selectedInquiry.saikiweb_phone}</a>
                  </div>
                )}
                {selectedInquiry.saikiweb_company && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Company</p>
                    <p className="text-gray-900">{selectedInquiry.saikiweb_company}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${(categoryLabels[selectedInquiry.saikiweb_category] || { color: 'bg-gray-100 text-gray-700' }).color}`}>
                    {(categoryLabels[selectedInquiry.saikiweb_category] || { label: selectedInquiry.saikiweb_category }).label}
                  </span>
                </div>
                {selectedInquiry.saikiweb_budget && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Budget</p>
                    <p className="text-gray-900">{selectedInquiry.saikiweb_budget}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-gray-900">{formatDate(selectedInquiry.saikiweb_created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Locale</p>
                  <p className="text-gray-900">{selectedInquiry.saikiweb_locale.toUpperCase()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Message</p>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.saikiweb_message}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`mailto:${selectedInquiry.saikiweb_email}`}
                  className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition text-center"
                >
                  Reply via Email
                </a>
                {selectedInquiry.saikiweb_phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.saikiweb_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition text-center"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Email Test Result Modal */}
      {emailTest.result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEmailTest({ loading: false, result: null })} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">Email Test Result</h2>
              <button onClick={() => setEmailTest({ loading: false, result: null })} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <pre className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(emailTest.result, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
