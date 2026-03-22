'use client';

import { useState, useEffect, useCallback } from 'react';

interface Article {
  saikiweb_article_id: number;
  saikiweb_slug: string;
  saikiweb_locale: string;
  saikiweb_title: string;
  saikiweb_excerpt: string;
  saikiweb_body: string;
  saikiweb_category: string;
  saikiweb_category_key: string;
  saikiweb_date: string;
  saikiweb_read_time: string;
  saikiweb_featured: boolean;
  saikiweb_published: boolean;
  saikiweb_meta_title: string | null;
  saikiweb_meta_description: string | null;
  saikiweb_keywords: string[] | null;
  saikiweb_created_at: string;
  saikiweb_updated_at: string;
}

interface LocaleFields {
  title: string;
  excerpt: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  readTime: string;
  category: string;
}

interface ArticleForm {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  categoryKey: string;
  date: string;
  readTime: string;
  featured: boolean;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

const emptyLocaleFields: LocaleFields = {
  title: '',
  excerpt: '',
  body: '',
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  readTime: '',
  category: '',
};

const emptyForm: ArticleForm = {
  slug: '',
  locale: 'id',
  title: '',
  excerpt: '',
  body: '',
  category: '',
  categoryKey: 'consultancy',
  date: '',
  readTime: '',
  featured: false,
  published: false,
  metaTitle: '',
  metaDescription: '',
  keywords: '',
};

const categoryOptions = [
  { key: 'consultancy', labelId: 'Karier', labelEn: 'Career' },
  { key: 'imagery', labelId: 'Branding', labelEn: 'Branding' },
  { key: 'technology', labelId: 'Teknologi', labelEn: 'Technology' },
];

export default function AdminArticlesPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [localeFilter, setLocaleFilter] = useState('all');

  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Tab state for editor
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  // Dual locale mode
  const [dualLocale, setDualLocale] = useState(false);
  const [activeLocaleTab, setActiveLocaleTab] = useState<'id' | 'en'>('id');
  const [enFields, setEnFields] = useState<LocaleFields>(emptyLocaleFields);
  const [enSlug, setEnSlug] = useState('');

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

  const fetchArticles = useCallback(async () => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (localeFilter !== 'all') params.set('locale', localeFilter);

      const res = await fetch(`/api/admin/articles?${params}`, {
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) {
        setArticles(data.data || []);
      } else if (res.status === 401) {
        setAuthenticated(false);
        sessionStorage.removeItem('admin_pw');
      }
    } catch {
      console.error('Failed to fetch articles');
    }
    setLoading(false);
  }, [localeFilter]);

  useEffect(() => {
    if (authenticated) fetchArticles();
  }, [authenticated, localeFilter, fetchArticles]);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const formatReadTime = (raw: string, locale: string) => {
    if (!raw) return '';
    if (!raw.includes('|')) return raw; // already formatted
    const [num, unit] = raw.split('|');
    if (!num) return '';
    const n = parseInt(num, 10);
    if (locale === 'id') {
      return `${n} ${unit}`;
    }
    const enUnits: Record<string, string> = { detik: 'sec read', menit: 'min read', jam: 'hour read' };
    return `${n} ${enUnits[unit] || unit}`;
  };

  const formatDateForLocale = (dateStr: string, locale: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d.getTime())) return dateStr;
      if (locale === 'id') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const saveArticle = async (pw: string, payload: Record<string, unknown>, method: string) => {
    const res = await fetch('/api/admin/articles', {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
      body: JSON.stringify(payload),
    });
    return res.json();
  };

  const handleSave = async () => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    if (!form.slug || !form.title || !form.body || !form.excerpt) {
      setSaveError('Slug, title, excerpt, and body are required (ID)');
      return;
    }

    if (dualLocale && !editingId) {
      if (!enFields.title || !enFields.body || !enFields.excerpt) {
        setSaveError('Title, excerpt, and body are required for EN version too');
        return;
      }
      if (!enSlug) {
        setSaveError('EN slug is required');
        return;
      }
    }

    setSaving(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const catOpt = categoryOptions.find((c) => c.key === form.categoryKey);

      // Save ID version
      const saveLocale = editingId ? form.locale : 'id';
      const idPayload = {
        ...form,
        locale: saveLocale,
        date: formatDateForLocale(form.date, saveLocale),
        readTime: formatReadTime(form.readTime, saveLocale),
        category: catOpt?.labelId || form.category,
        keywords: form.keywords ? form.keywords.split(',').map((k) => k.trim()).filter(Boolean) : null,
        ...(editingId ? { id: editingId } : {}),
      };

      const idResult = await saveArticle(pw, idPayload, method);

      if (!idResult.success) {
        setSaveError(idResult.error || 'Failed to save ID version');
        setSaving(false);
        return;
      }

      // Save EN version if dual locale
      if (dualLocale && !editingId) {
        const enPayload = {
          slug: enSlug,
          locale: 'en',
          title: enFields.title,
          excerpt: enFields.excerpt,
          body: enFields.body,
          category: catOpt?.labelEn || form.category,
          categoryKey: form.categoryKey,
          date: formatDateForLocale(form.date, 'en'),
          readTime: formatReadTime(form.readTime, 'en'),
          featured: form.featured,
          published: form.published,
          metaTitle: enFields.metaTitle || null,
          metaDescription: enFields.metaDescription || null,
          keywords: enFields.keywords ? enFields.keywords.split(',').map((k) => k.trim()).filter(Boolean) : null,
        };

        const enResult = await saveArticle(pw, enPayload, 'POST');
        if (!enResult.success) {
          setSaveError(`ID saved, but EN failed: ${enResult.error}`);
          setSaving(false);
          fetchArticles();
          return;
        }
      }

      setSaveSuccess(dualLocale && !editingId ? 'Both ID & EN articles created!' : editingId ? 'Article updated!' : 'Article created!');
      setEditing(false);
      setEditingId(null);
      setForm(emptyForm);
      setEnFields(emptyLocaleFields);
      setEnSlug('');
      setDualLocale(false);
      fetchArticles();
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch {
      setSaveError('Connection error');
    }
    setSaving(false);
  };

  const parseReadTimeToInput = (readTime: string) => {
    if (!readTime) return '';
    if (readTime.includes('|')) return readTime;
    const num = readTime.replace(/\D/g, '');
    if (!num) return readTime;
    if (readTime.includes('jam') || readTime.includes('hour')) return `${num}|jam`;
    if (readTime.includes('detik') || readTime.includes('sec')) return `${num}|detik`;
    return `${num}|menit`;
  };

  const parseDateToInput = (dateStr: string) => {
    if (!dateStr) return '';
    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // Try parsing display format
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    } catch { /* fall through */ }
    return '';
  };

  const handleEdit = (article: Article) => {
    setForm({
      slug: article.saikiweb_slug,
      locale: article.saikiweb_locale,
      title: article.saikiweb_title,
      excerpt: article.saikiweb_excerpt,
      body: article.saikiweb_body,
      category: article.saikiweb_category,
      categoryKey: article.saikiweb_category_key,
      date: parseDateToInput(article.saikiweb_date),
      readTime: parseReadTimeToInput(article.saikiweb_read_time),
      featured: article.saikiweb_featured,
      published: article.saikiweb_published,
      metaTitle: article.saikiweb_meta_title || '',
      metaDescription: article.saikiweb_meta_description || '',
      keywords: (article.saikiweb_keywords || []).join(', '),
    });
    setEditingId(article.saikiweb_article_id);
    setEditing(true);
    setEditorTab('write');
    setSaveError('');
    setSaveSuccess('');
  };

  const handleDelete = async (id: number) => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirm(null);
        fetchArticles();
      }
    } catch {
      console.error('Failed to delete');
    }
  };

  const handleNewArticle = () => {
    setForm(emptyForm);
    setEditingId(null);
    setEditing(true);
    setEditorTab('write');
    setSaveError('');
    setSaveSuccess('');
    setDualLocale(false);
    setActiveLocaleTab('id');
    setEnFields(emptyLocaleFields);
    setEnSlug('');
  };

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

  // Render editor/form
  if (editing) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => { setEditing(false); setEditingId(null); }} className="text-gray-500 hover:text-gray-700 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Article' : 'New Article'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setPreviewOpen(true)} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                Preview
              </button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition disabled:opacity-50">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {saveError && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">{saveError}</div>
          )}
          {saveSuccess && (
            <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-200">{saveSuccess}</div>
          )}

          {/* Dual locale toggle for new articles */}
          {!editingId && (
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer bg-white rounded-xl px-4 py-3 border border-gray-200 w-fit">
                <input
                  type="checkbox"
                  checked={dualLocale}
                  onChange={(e) => {
                    setDualLocale(e.target.checked);
                    if (e.target.checked) setActiveLocaleTab('id');
                  }}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">Create both ID & EN versions at once</span>
              </label>
            </div>
          )}

          {/* Locale tabs when dual mode */}
          {dualLocale && !editingId && (
            <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
              <button
                onClick={() => setActiveLocaleTab('id')}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition ${activeLocaleTab === 'id' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Indonesian (ID)
              </button>
              <button
                onClick={() => setActiveLocaleTab('en')}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition ${activeLocaleTab === 'en' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                English (EN)
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" title="Judul utama artikel yang tampil di halaman detail dan card. Buat menarik dan mengandung keyword utama. Contoh: '5 Kesalahan Fatal Saat Bikin Brand Identity'">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Title {dualLocale && `(${activeLocaleTab.toUpperCase()})`}
                </label>
                {(!dualLocale || activeLocaleTab === 'id') ? (
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      setForm({ ...form, title: e.target.value });
                      if (!editingId && !form.slug) {
                        setForm((f) => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }));
                      }
                    }}
                    placeholder="Judul artikel..."
                    title="Judul artikel dalam Bahasa Indonesia. Contoh: 'Mengapa Personal Branding Lebih Penting dari CV di 2025'"
                    className="w-full text-2xl font-bold text-gray-900 border-none outline-none placeholder:text-gray-300"
                  />
                ) : (
                  <input
                    type="text"
                    value={enFields.title}
                    onChange={(e) => {
                      setEnFields({ ...enFields, title: e.target.value });
                      if (!enSlug) setEnSlug(generateSlug(e.target.value));
                    }}
                    placeholder="Article title (English)..."
                    title="Article title in English. Example: 'Why Personal Branding Matters More Than Your CV in 2025'"
                    className="w-full text-2xl font-bold text-gray-900 border-none outline-none placeholder:text-gray-300"
                  />
                )}
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" title="Ringkasan singkat 1-2 kalimat yang muncul di card insight dan di bawah judul halaman artikel. Harus bikin orang penasaran untuk klik dan baca. Contoh: 'Banyak bisnis habis jutaan untuk logo cantik tapi tetap nggak dikenal.'">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Excerpt {dualLocale && `(${activeLocaleTab.toUpperCase()})`}
                </label>
                {(!dualLocale || activeLocaleTab === 'id') ? (
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Ringkasan singkat untuk card..."
                    title="Ringkasan artikel dalam Bahasa Indonesia. Tampil di card dan hero artikel."
                    rows={2}
                    className="w-full text-sm text-gray-700 border-none outline-none resize-none placeholder:text-gray-300 leading-relaxed"
                  />
                ) : (
                  <textarea
                    value={enFields.excerpt}
                    onChange={(e) => setEnFields({ ...enFields, excerpt: e.target.value })}
                    placeholder="Brief summary for cards (English)..."
                    title="Article excerpt in English. Shown on cards and article hero."
                    rows={2}
                    className="w-full text-sm text-gray-700 border-none outline-none resize-none placeholder:text-gray-300 leading-relaxed"
                  />
                )}
              </div>

              {/* Body editor */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" title="Isi lengkap artikel. Tulis langsung atau paste HTML dari editor lain. Tag yang didukung: <p> untuk paragraf, <h2> untuk heading section, <h3> untuk sub-heading, <blockquote> untuk kutipan yang di-highlight, <ul>/<ol> untuk list, <strong> untuk bold, <em> untuk italic, <a> untuk link, <hr> untuk garis pemisah.">
                <div className="flex items-center gap-0 border-b border-gray-200">
                  <button
                    onClick={() => setEditorTab('write')}
                    className={`px-5 py-3 text-sm font-medium transition ${editorTab === 'write' ? 'text-teal-700 border-b-2 border-teal-600 bg-teal-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Write HTML
                  </button>
                  <button
                    onClick={() => setEditorTab('preview')}
                    className={`px-5 py-3 text-sm font-medium transition ${editorTab === 'preview' ? 'text-teal-700 border-b-2 border-teal-600 bg-teal-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Preview
                  </button>
                  <div className="flex-1" />
                  <div className="px-4 text-xs text-gray-400">
                    HTML supported. Use &lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;strong&gt;, &lt;em&gt;
                  </div>
                </div>

                {editorTab === 'write' ? (
                  <textarea
                    value={(!dualLocale || activeLocaleTab === 'id') ? form.body : enFields.body}
                    onChange={(e) => {
                      if (!dualLocale || activeLocaleTab === 'id') {
                        setForm({ ...form, body: e.target.value });
                      } else {
                        setEnFields({ ...enFields, body: e.target.value });
                      }
                    }}
                    placeholder={(!dualLocale || activeLocaleTab === 'id')
                      ? `Tulis isi artikel di sini. Bisa paste HTML langsung.\n\nContoh:\n<p>Paragraf pembuka...</p>\n\n<h2>Heading Section</h2>\n<p>Isi section...</p>\n\n<blockquote>Quote yang di-highlight.</blockquote>`
                      : `Write your article body here (English). Paste HTML directly.\n\nExample:\n<p>Opening paragraph...</p>\n\n<h2>Section Heading</h2>\n<p>Section content...</p>\n\n<blockquote>A highlighted quote.</blockquote>`
                    }
                    rows={24}
                    className="w-full p-6 text-sm text-gray-800 font-mono border-none outline-none resize-y placeholder:text-gray-300 leading-relaxed"
                    spellCheck={false}
                  />
                ) : (
                  <div className="p-6 min-h-[400px]">
                    {((!dualLocale || activeLocaleTab === 'id') ? form.body : enFields.body) ? (
                      <div
                        className="article-preview prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: (!dualLocale || activeLocaleTab === 'id') ? form.body : enFields.body }}
                      />
                    ) : (
                      <p className="text-gray-400 italic">Nothing to preview yet...</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish settings */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Publish Settings</h3>

                <div title="Bagian URL artikel setelah /insights/. Otomatis dibuat dari judul. Gunakan huruf kecil, tanpa spasi (pakai strip). Contoh: 'kesalahan-fatal-brand-identity'">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Slug (ID)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="slug-artikel-indonesia"
                    title="URL slug Bahasa Indonesia. Contoh: 'mengapa-personal-branding-penting'"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none transition"
                  />
                </div>

                {dualLocale && !editingId && (
                  <div title="URL slug untuk versi Bahasa Inggris. Harus berbeda dari slug ID. Contoh: 'why-personal-branding-matters'">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Slug (EN)
                    </label>
                    <input
                      type="text"
                      value={enSlug}
                      onChange={(e) => setEnSlug(e.target.value)}
                      placeholder="english-article-slug"
                      title="English URL slug. Example: 'why-personal-branding-matters'"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none transition"
                    />
                  </div>
                )}

                {!dualLocale && (
                  <div title="Bahasa artikel. ID = Bahasa Indonesia, EN = English. Artikel yang sama perlu dibuat terpisah untuk tiap bahasa, atau gunakan mode dual-locale.">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Locale</label>
                    <select
                      value={form.locale}
                      onChange={(e) => setForm({ ...form, locale: e.target.value })}
                      title="Pilih bahasa artikel"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                    >
                      <option value="id">Indonesian (ID)</option>
                      <option value="en">English (EN)</option>
                    </select>
                  </div>
                )}

                <div title="Kategori layanan SAIKI yang relevan dengan artikel. Menentukan warna tag dan pengelompokan. Karier = SAIKI Consultancy, Branding = SAIKI Imagery, Teknologi = SAIKI Technology.">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={form.categoryKey}
                    onChange={(e) => {
                      const opt = categoryOptions.find((c) => c.key === e.target.value);
                      setForm({
                        ...form,
                        categoryKey: e.target.value,
                        category: form.locale === 'id' ? (opt?.labelId || '') : (opt?.labelEn || ''),
                      });
                    }}
                    title="Pilih kategori yang paling relevan"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.labelId} / {c.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div title="Tanggal publikasi artikel. Otomatis diformat sesuai locale: ID = '15 Mar 2025', EN = 'Mar 15, 2025'.">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      title="Pilih tanggal publikasi"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none transition"
                    />
                  </div>
                  <div title="Estimasi waktu baca artikel. Pilih angka dan satuan. Otomatis diformat sesuai locale: ID = '5 menit', EN = '5 min read'.">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Read Time</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={form.readTime.replace(/\D/g, '') || ''}
                        onChange={(e) => {
                          const num = e.target.value;
                          const unit = form.readTime.includes('jam') || form.readTime.includes('hour') ? 'jam'
                            : form.readTime.includes('detik') || form.readTime.includes('sec') ? 'detik'
                            : 'menit';
                          setForm({ ...form, readTime: num ? `${num}|${unit}` : '' });
                        }}
                        placeholder="5"
                        title="Angka waktu baca"
                        className="w-16 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none transition text-center"
                      />
                      <select
                        value={form.readTime.includes('|') ? form.readTime.split('|')[1] : 'menit'}
                        onChange={(e) => {
                          const num = form.readTime.replace(/\D/g, '') || form.readTime.split('|')[0] || '';
                          setForm({ ...form, readTime: num ? `${num}|${e.target.value}` : '' });
                        }}
                        title="Satuan waktu"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none"
                      >
                        <option value="detik">Detik</option>
                        <option value="menit">Menit</option>
                        <option value="jam">Jam</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer" title="Artikel featured ditampilkan lebih besar (2 kolom) di halaman Insights. Gunakan untuk artikel unggulan yang mau ditonjolkan. Biasanya cukup 1-2 artikel yang di-featured.">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer" title="Artikel yang di-publish akan tampil di website publik. Jika tidak dicentang, artikel tersimpan sebagai draft dan hanya bisa dilihat di admin.">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">Published</span>
                  </label>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-900" title="Pengaturan SEO menentukan bagaimana artikel muncul di hasil pencarian Google. Isi semua field untuk hasil terbaik.">
                  SEO Settings {dualLocale && `(${activeLocaleTab.toUpperCase()})`}
                </h3>

                <div title="Judul yang muncul di tab browser dan hasil pencarian Google. Idealnya 50-60 karakter. Harus mengandung keyword utama dan nama brand. Contoh: 'Personal Branding vs CV: Mana Lebih Penting di 2025? | SAIKI'">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meta Title</label>
                    <span className={`text-xs ${(((!dualLocale || activeLocaleTab === 'id') ? form.metaTitle : enFields.metaTitle)?.length || 0) > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                      {((!dualLocale || activeLocaleTab === 'id') ? form.metaTitle : enFields.metaTitle)?.length || 0}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    value={(!dualLocale || activeLocaleTab === 'id') ? form.metaTitle : enFields.metaTitle}
                    onChange={(e) => {
                      if (!dualLocale || activeLocaleTab === 'id') {
                        setForm({ ...form, metaTitle: e.target.value });
                      } else {
                        setEnFields({ ...enFields, metaTitle: e.target.value });
                      }
                    }}
                    placeholder="SEO optimized title | SAIKI"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none transition"
                  />
                </div>

                <div title="Deskripsi yang muncul di bawah judul di hasil pencarian Google. Idealnya 150-160 karakter. Harus mengandung keyword dan call-to-action. Contoh: '70% recruiter cek media sosial sebelum wawancara. Pelajari 5 langkah membangun personal branding yang kuat.'">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meta Description</label>
                    <span className={`text-xs ${(((!dualLocale || activeLocaleTab === 'id') ? form.metaDescription : enFields.metaDescription)?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                      {((!dualLocale || activeLocaleTab === 'id') ? form.metaDescription : enFields.metaDescription)?.length || 0}/160
                    </span>
                  </div>
                  <textarea
                    value={(!dualLocale || activeLocaleTab === 'id') ? form.metaDescription : enFields.metaDescription}
                    onChange={(e) => {
                      if (!dualLocale || activeLocaleTab === 'id') {
                        setForm({ ...form, metaDescription: e.target.value });
                      } else {
                        setEnFields({ ...enFields, metaDescription: e.target.value });
                      }
                    }}
                    placeholder="Compelling description with keywords..."
                    title="Deskripsi untuk hasil pencarian Google. Max 160 karakter."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none transition resize-none"
                  />
                </div>

                <div title="Kata kunci yang relevan dengan artikel, dipisah koma. Membantu mesin pencari memahami topik artikel. Contoh: 'personal branding, tips karier, LinkedIn, SAIKI Consultancy'">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Keywords</label>
                  <input
                    type="text"
                    value={(!dualLocale || activeLocaleTab === 'id') ? form.keywords : enFields.keywords}
                    onChange={(e) => {
                      if (!dualLocale || activeLocaleTab === 'id') {
                        setForm({ ...form, keywords: e.target.value });
                      } else {
                        setEnFields({ ...enFields, keywords: e.target.value });
                      }
                    }}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-teal-500 outline-none transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                </div>

                {/* SEO Preview */}
                {(form.metaTitle || form.metaDescription) && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Search Preview</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-blue-700 text-sm font-medium truncate">
                        {form.metaTitle || form.title || 'Page Title'}
                      </p>
                      <p className="text-green-700 text-xs mt-0.5">
                        saiki.id/insights/{form.slug || 'article-slug'}
                      </p>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {form.metaDescription || form.excerpt || 'Description will appear here...'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Preview modal */}
        {previewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewOpen(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-lg font-bold text-gray-900">Article Preview</h2>
                <button onClick={() => setPreviewOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                    form.categoryKey === 'consultancy' ? 'bg-blue-100 text-blue-700' :
                    form.categoryKey === 'imagery' ? 'bg-purple-100 text-purple-700' :
                    'bg-teal-100 text-teal-700'
                  }`}>
                    {form.category || form.categoryKey}
                  </span>
                  <span className="text-sm text-gray-500">{form.date}</span>
                  <span className="text-sm text-gray-500">{form.readTime}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title || 'Untitled'}</h1>
                <p className="text-lg text-gray-600 mb-8">{form.excerpt}</p>
                <hr className="mb-8" />
                <div
                  className="article-preview prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: form.body || '<p class="text-gray-400 italic">No content yet...</p>' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render list view
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
              <a href="/admin" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">
                Inquiries
              </a>
              <span className="px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg">
                Articles
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">{articles.length} articles</span>
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
        {saveSuccess && (
          <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-200">{saveSuccess}</div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <select
              value={localeFilter}
              onChange={(e) => setLocaleFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none"
            >
              <option value="all">All Locales</option>
              <option value="id">Indonesian (ID)</option>
              <option value="en">English (EN)</option>
            </select>
            <button
              onClick={fetchArticles}
              className="px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          <button
            onClick={handleNewArticle}
            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Article
          </button>
        </div>

        {/* Articles list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && articles.length === 0 ? (
            <div className="p-16 text-center text-gray-500">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-gray-500 mb-4">No articles yet.</p>
              <button onClick={handleNewArticle} className="text-teal-600 font-medium hover:underline">
                Create your first article
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {articles.map((article) => (
                <div key={article.saikiweb_article_id} className="px-6 py-5 flex items-start gap-4 hover:bg-gray-50/50 transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        article.saikiweb_category_key === 'consultancy' ? 'bg-blue-100 text-blue-700' :
                        article.saikiweb_category_key === 'imagery' ? 'bg-purple-100 text-purple-700' :
                        'bg-teal-100 text-teal-700'
                      }`}>
                        {article.saikiweb_category}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 uppercase">
                        {article.saikiweb_locale}
                      </span>
                      {article.saikiweb_featured && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Featured
                        </span>
                      )}
                      {article.saikiweb_published ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          Draft
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{article.saikiweb_title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{article.saikiweb_excerpt}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{article.saikiweb_date}</span>
                      <span>{article.saikiweb_read_time}</span>
                      <span>/{article.saikiweb_slug}</span>
                      {article.saikiweb_updated_at && (
                        <span>Updated {formatDate(article.saikiweb_updated_at)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-3 py-1.5 text-sm text-teal-600 hover:text-teal-800 font-medium hover:bg-teal-50 rounded-lg transition"
                    >
                      Edit
                    </button>
                    {deleteConfirm === article.saikiweb_article_id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(article.saikiweb_article_id)}
                          className="px-3 py-1.5 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 text-sm text-gray-500 font-medium hover:bg-gray-50 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(article.saikiweb_article_id)}
                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
