'use client';

import { useState, useEffect, useCallback } from 'react';

interface Article {
  saikiweb_article_id: number;
  saikiweb_slug: string;
  saikiweb_locale: string;
  saikiweb_title: string;
  saikiweb_excerpt: string;
  saikiweb_category_key: string;
  saikiweb_published: boolean;
}

interface SocialPost {
  saikiweb_post_id: number;
  saikiweb_platform: string;
  saikiweb_post_type: string;
  saikiweb_caption: string;
  saikiweb_hashtags: string[];
  saikiweb_media_urls: string[];
  saikiweb_locale: string;
  saikiweb_status: string;
  saikiweb_scheduled_at: string | null;
  saikiweb_published_at: string | null;
  saikiweb_post_url: string | null;
  saikiweb_article_slug: string | null;
  saikiweb_category_key: string | null;
  saikiweb_notes: string | null;
  saikiweb_created_at: string;
  saikiweb_updated_at: string;
}

interface PostForm {
  platform: string;
  postType: string;
  caption: string;
  hashtags: string;
  mediaUrls: string;
  locale: string;
  status: string;
  scheduledAt: string;
  publishedAt: string;
  postUrl: string;
  articleSlug: string;
  categoryKey: string;
  notes: string;
}

const emptyForm: PostForm = {
  platform: 'instagram',
  postType: 'single',
  caption: '',
  hashtags: '',
  mediaUrls: '',
  locale: 'id',
  status: 'draft',
  scheduledAt: '',
  publishedAt: '',
  postUrl: '',
  articleSlug: '',
  categoryKey: 'general',
  notes: '',
};

const platforms = [
  { value: 'instagram', label: 'Instagram', icon: '📷', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'twitter', label: 'X / Twitter', icon: '𝕏', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { value: 'facebook', label: 'Facebook', icon: '📘', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
];

const postTypes: Record<string, { value: string; label: string }[]> = {
  instagram: [
    { value: 'single', label: 'Single Post' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'reel', label: 'Reel' },
    { value: 'story', label: 'Story' },
  ],
  linkedin: [
    { value: 'single', label: 'Single Post' },
    { value: 'carousel', label: 'Document/Carousel' },
    { value: 'text', label: 'Text Only' },
  ],
  tiktok: [
    { value: 'reel', label: 'Video' },
    { value: 'single', label: 'Photo' },
    { value: 'carousel', label: 'Carousel' },
  ],
  twitter: [
    { value: 'text', label: 'Text' },
    { value: 'single', label: 'With Image' },
  ],
  facebook: [
    { value: 'single', label: 'Post' },
    { value: 'reel', label: 'Reel' },
    { value: 'story', label: 'Story' },
  ],
};

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  { value: 'scheduled', label: 'Scheduled', color: 'bg-amber-100 text-amber-700' },
  { value: 'published', label: 'Published', color: 'bg-green-100 text-green-700' },
  { value: 'archived', label: 'Archived', color: 'bg-red-100 text-red-600' },
];

const categoryOptions = [
  { value: 'general', label: 'General' },
  { value: 'consultancy', label: 'Consultancy' },
  { value: 'imagery', label: 'Imagery' },
  { value: 'technology', label: 'Technology' },
];

// Platform-specific copywriting prompt generator
function generateCaptionPrompt(platform: string, postType: string, article: { title: string; excerpt: string; slug: string; locale: string }, siteUrl: string): string {
  const articleUrl = `${siteUrl}/${article.locale}/insights/${article.slug}`;
  const lang = article.locale === 'id' ? 'Bahasa Indonesia (casual, gunakan "kamu" bukan "Anda")' : 'English';

  const platformRules: Record<string, string> = {
    instagram: `PLATFORM: Instagram ${postType === 'carousel' ? 'Carousel' : postType === 'reel' ? 'Reel' : 'Feed Post'}
STYLE RULES:
- Buka dengan hook yang bikin stop scrolling (1 kalimat pendek, bold, provokatif)
- Gunakan line breaks untuk readability (jangan paragraf panjang)
- Pakai emoji secukupnya untuk visual cue, JANGAN berlebihan
- Akhiri dengan CTA yang engaging: ajak comment, save, atau share
- ${postType === 'carousel' ? 'Buat outline 7-10 slide: Slide 1 = cover hook, Slide 2-8 = poin utama (1 insight per slide), Slide terakhir = CTA + link' : 'Tulis caption 150-300 kata'}
- Tambahkan 15-20 hashtag yang relevan (campuran populer + niche)
- Tone: conversational, relatable, kayak teman yang expert`,

    linkedin: `PLATFORM: LinkedIn ${postType === 'text' ? 'Text Post' : postType === 'carousel' ? 'Document Post' : 'Post'}
STYLE RULES:
- Buka dengan hook 1-2 baris yang memancing rasa ingin tahu (personal story atau data mengejutkan)
- Gunakan format pendek per paragraf (1-2 kalimat per paragraf, banyak white space)
- Sertakan personal insight atau pengalaman nyata
- Gunakan angka dan data jika ada
- ${postType === 'carousel' ? 'Buat outline 8-12 slide dokumen PDF: judul tiap slide + poin utama' : 'Tulis post 200-400 kata'}
- Akhiri dengan pertanyaan terbuka untuk memancing diskusi
- Tambahkan 3-5 hashtag profesional saja
- Tone: professional tapi approachable, thought leadership`,

    tiktok: `PLATFORM: TikTok ${postType === 'reel' ? 'Video' : 'Post'}
STYLE RULES:
- Buka dengan hook 3 detik pertama: "Kamu pasti belum tahu ini..." / "Stop! Jangan [X] sebelum baca ini"
- ${postType === 'reel' ? 'Tulis script video 30-60 detik: hook > masalah > insight > solusi > CTA. Format: [SCENE 1] narasi...' : 'Tulis caption pendek 50-100 kata'}
- Bahasa super casual, kayak ngomong ke teman
- Pakai trending angle: myth-busting, "things nobody tells you", listicle
- CTA: "Follow untuk tips lainnya" / "Save biar nggak lupa"
- Tambahkan 5-8 hashtag (campuran trending + niche)
- Tone: energetic, fun, to the point`,

    twitter: `PLATFORM: X (Twitter) Thread/Tweet
STYLE RULES:
- Tweet utama: max 280 karakter, hook yang bikin penasaran
- Buat thread 5-8 tweet: Tweet 1 = hook, Tweet 2-6 = insight per poin, Tweet terakhir = ringkasan + CTA
- Setiap tweet harus bisa berdiri sendiri tapi connect ke keseluruhan
- Gunakan angka di awal: "5 alasan...", "3 kesalahan..."
- Tambahkan 2-3 hashtag saja
- Tone: sharp, witty, concise`,

    facebook: `PLATFORM: Facebook ${postType === 'reel' ? 'Reel' : 'Post'}
STYLE RULES:
- Buka dengan storytelling singkat atau pertanyaan relatable
- ${postType === 'reel' ? 'Tulis script video 30-60 detik dengan narasi' : 'Tulis post 150-300 kata'}
- Bahasa warm dan conversational
- Sertakan pertanyaan di akhir untuk engagement
- CTA: ajak share ke teman yang butuh info ini
- Tambahkan 3-5 hashtag
- Tone: friendly, community-oriented, shareable`,
  };

  return `Kamu adalah social media copywriter untuk SAIKI Group, ekosistem terintegrasi untuk konsultansi karier, branding & marketing, dan teknologi.

TUGAS: Buat caption/copy untuk membagikan artikel berikut ke ${platforms.find(p => p.value === platform)?.label || platform}:

ARTIKEL:
- Judul: "${article.title}"
- Ringkasan: "${article.excerpt}"
- URL: ${articleUrl}

${platformRules[platform] || platformRules.instagram}

BAHASA: ${lang}

ATURAN UMUM:
- JANGAN copy-paste isi artikel. Buat caption yang bikin orang PENASARAN untuk klik dan baca
- Sertakan link artikel di akhir caption
- JANGAN gunakan emdash (--)
- Output HANYA caption/copy yang siap dipakai (tanpa penjelasan tambahan)
- Pastikan sesuai character limit platform`;
}


export default function AdminSocialPostsPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [captionPrompt, setCaptionPrompt] = useState('');
  const [promptCopied, setPromptCopied] = useState(false);

  // Auth
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

  // Fetch
  const fetchPosts = useCallback(async () => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (platformFilter !== 'all') params.set('platform', platformFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/social-posts?${params}`, {
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.data || []);
      } else if (res.status === 401) {
        setAuthenticated(false);
        sessionStorage.removeItem('admin_pw');
      }
    } catch {
      console.error('Failed to fetch posts');
    }
    setLoading(false);
  }, [platformFilter, statusFilter]);

  const fetchArticles = useCallback(async () => {
    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;
    try {
      const res = await fetch('/api/admin/articles?published=true', {
        headers: { 'x-admin-password': pw },
      });
      const data = await res.json();
      if (data.success) setArticles(data.data || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (authenticated) { fetchPosts(); fetchArticles(); }
  }, [authenticated, platformFilter, statusFilter, fetchPosts, fetchArticles]);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  // CRUD handlers
  const handleNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setEditing(true);
    setSaveError('');
    setSaveSuccess('');
  };

  const handleEdit = (post: SocialPost) => {
    setForm({
      platform: post.saikiweb_platform,
      postType: post.saikiweb_post_type,
      caption: post.saikiweb_caption,
      hashtags: (post.saikiweb_hashtags || []).join(', '),
      mediaUrls: (post.saikiweb_media_urls || []).join('\n'),
      locale: post.saikiweb_locale,
      status: post.saikiweb_status,
      scheduledAt: post.saikiweb_scheduled_at ? post.saikiweb_scheduled_at.slice(0, 16) : '',
      publishedAt: post.saikiweb_published_at ? post.saikiweb_published_at.slice(0, 16) : '',
      postUrl: post.saikiweb_post_url || '',
      articleSlug: post.saikiweb_article_slug || '',
      categoryKey: post.saikiweb_category_key || 'general',
      notes: post.saikiweb_notes || '',
    });
    setEditingId(post.saikiweb_post_id);
    setEditing(true);
    setSaveError('');
    setSaveSuccess('');
  };

  const handleSave = async () => {
    if (!form.caption.trim()) {
      setSaveError('Caption is required');
      return;
    }
    setSaving(true);
    setSaveError('');
    const pw = sessionStorage.getItem('admin_pw');

    const payload = {
      id: editingId,
      platform: form.platform,
      postType: form.postType,
      caption: form.caption.trim(),
      hashtags: form.hashtags ? form.hashtags.split(',').map((h) => h.trim().replace(/^#/, '')).filter(Boolean) : [],
      mediaUrls: form.mediaUrls ? form.mediaUrls.split('\n').map((u) => u.trim()).filter(Boolean) : [],
      locale: form.locale,
      status: form.status,
      scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      postUrl: form.postUrl.trim() || null,
      articleSlug: form.articleSlug.trim() || null,
      categoryKey: form.categoryKey,
      notes: form.notes.trim() || null,
    };

    try {
      const res = await fetch('/api/admin/social-posts', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw || '' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(editingId ? 'Post updated!' : 'Post created!');
        setEditing(false);
        fetchPosts();
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        setSaveError(data.error || 'Save failed');
      }
    } catch {
      setSaveError('Connection error');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    const pw = sessionStorage.getItem('admin_pw');
    try {
      const res = await fetch(`/api/admin/social-posts?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': pw || '' },
      });
      const data = await res.json();
      if (data.success) {
        fetchPosts();
        setSaveSuccess('Post deleted');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch {
      console.error('Delete failed');
    }
    setDeleteConfirm(null);
  };

  // Helpers
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getPlatformInfo = (key: string) => platforms.find((p) => p.value === key) || platforms[0];
  const getStatusInfo = (key: string) => statusOptions.find((s) => s.value === key) || statusOptions[0];
  const getAvailablePostTypes = (platform: string) => postTypes[platform] || postTypes.instagram;

  const charCount = form.caption.length;
  const charLimit: Record<string, number> = { instagram: 2200, linkedin: 3000, tiktok: 4000, twitter: 280, facebook: 63206 };
  const maxChars = charLimit[form.platform] || 2200;

  // Login screen
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

  // Editor view
  if (editing) {
    return (
      <div className="min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Post' : 'New Social Post'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {saveError && <span className="text-red-500 text-sm">{saveError}</span>}
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Platform & Type */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Platform & Type</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {platforms.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => {
                        setForm((f) => ({
                          ...f,
                          platform: p.value,
                          postType: (postTypes[p.value]?.[0]?.value) || 'single',
                        }));
                      }}
                      className={`px-3 py-2 text-sm font-medium rounded-xl border transition ${
                        form.platform === p.value
                          ? p.color + ' border-current'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-1.5">{p.icon}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {getAvailablePostTypes(form.platform).map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setForm((f) => ({ ...f, postType: t.value }))}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                        form.postType === t.value
                          ? 'bg-teal-50 text-teal-700 border-teal-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900">Caption</h2>
                  <span className={`text-xs ${charCount > maxChars ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                    {charCount} / {maxChars}
                  </span>
                </div>
                <textarea
                  value={form.caption}
                  onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                  rows={8}
                  placeholder="Write your caption here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm leading-relaxed resize-y"
                />
              </div>

              {/* Caption Generator */}
              {form.articleSlug && (() => {
                const linked = articles.find((a) => a.saikiweb_slug === form.articleSlug);
                if (!linked) return null;
                return (
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-sm font-semibold text-teal-900">Caption Generator</h2>
                        <p className="text-xs text-teal-600 mt-0.5">Generate AI prompt sesuai gaya {platforms.find(p => p.value === form.platform)?.label}</p>
                      </div>
                      <button
                        onClick={() => {
                          const prompt = generateCaptionPrompt(
                            form.platform,
                            form.postType,
                            { title: linked.saikiweb_title, excerpt: linked.saikiweb_excerpt, slug: linked.saikiweb_slug, locale: linked.saikiweb_locale },
                            'https://saiki.id'
                          );
                          setCaptionPrompt(prompt);
                          setPromptCopied(false);
                        }}
                        className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition"
                      >
                        Generate Prompt
                      </button>
                    </div>
                    {captionPrompt && (
                      <div className="mt-3">
                        <div className="bg-white rounded-xl p-4 max-h-48 overflow-y-auto">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{captionPrompt}</pre>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={async () => {
                              await navigator.clipboard.writeText(captionPrompt);
                              setPromptCopied(true);
                              setTimeout(() => setPromptCopied(false), 2000);
                            }}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                              promptCopied ? 'bg-green-100 text-green-700' : 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50'
                            }`}
                          >
                            {promptCopied ? 'Copied!' : 'Copy Prompt'}
                          </button>
                          <span className="text-xs text-teal-500">Paste ke ChatGPT / Claude / Gemini, lalu paste hasilnya di Caption</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Hashtags */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Hashtags</h2>
                <input
                  value={form.hashtags}
                  onChange={(e) => setForm((f) => ({ ...f, hashtags: e.target.value }))}
                  placeholder="saiki, branding, technology (comma-separated)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm"
                />
                {form.hashtags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {form.hashtags.split(',').map((h) => h.trim()).filter(Boolean).map((h, i) => (
                      <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-md">
                        #{h.replace(/^#/, '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Media URLs */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-1">Media URLs</h2>
                <p className="text-xs text-gray-400 mb-3">One URL per line (images, videos, or cloud storage links)</p>
                <textarea
                  value={form.mediaUrls}
                  onChange={(e) => setForm((f) => ({ ...f, mediaUrls: e.target.value }))}
                  rows={3}
                  placeholder={"https://drive.google.com/...\nhttps://example.com/image.jpg"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm font-mono resize-y"
                />
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Internal Notes</h2>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="Internal notes, ideas, revision requests..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition text-sm resize-y"
                />
              </div>
            </div>

            {/* Right: Settings sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Status</h2>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-teal-500 outline-none"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                {form.status === 'scheduled' && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Schedule Date & Time</label>
                    <input
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-teal-500 outline-none"
                    />
                  </div>
                )}

                {form.status === 'published' && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Published Date</label>
                    <input
                      type="datetime-local"
                      value={form.publishedAt}
                      onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-teal-500 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Category & Locale */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">Category</h2>
                  <select
                    value={form.categoryKey}
                    onChange={(e) => setForm((f) => ({ ...f, categoryKey: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-teal-500 outline-none"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">Locale</h2>
                  <select
                    value={form.locale}
                    onChange={(e) => setForm((f) => ({ ...f, locale: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-teal-500 outline-none"
                  >
                    <option value="id">Indonesian (ID)</option>
                    <option value="en">English (EN)</option>
                  </select>
                </div>
              </div>

              {/* Linked Article */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">Linked Article</h2>
                <p className="text-xs text-gray-400 mb-2">Pilih artikel yang ingin dibagikan</p>
                <select
                  value={form.articleSlug}
                  onChange={(e) => {
                    const slug = e.target.value;
                    const article = articles.find((a) => a.saikiweb_slug === slug);
                    setForm((f) => ({
                      ...f,
                      articleSlug: slug,
                      locale: article?.saikiweb_locale || f.locale,
                      categoryKey: article?.saikiweb_category_key || f.categoryKey,
                    }));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-teal-500 outline-none"
                >
                  <option value="">-- No article linked --</option>
                  {articles.map((a) => (
                    <option key={`${a.saikiweb_article_id}`} value={a.saikiweb_slug}>
                      [{a.saikiweb_locale.toUpperCase()}] {a.saikiweb_title}
                    </option>
                  ))}
                </select>
                {form.articleSlug && (() => {
                  const linked = articles.find((a) => a.saikiweb_slug === form.articleSlug);
                  return linked ? (
                    <div className="mt-3 p-3 bg-teal-50 rounded-lg">
                      <p className="text-xs font-medium text-teal-800 mb-1">{linked.saikiweb_title}</p>
                      <p className="text-xs text-teal-600 line-clamp-2">{linked.saikiweb_excerpt}</p>
                      <a
                        href={`/${linked.saikiweb_locale}/insights/${linked.saikiweb_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1.5 text-xs text-teal-700 font-medium hover:underline"
                      >
                        View article &rarr;
                      </a>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Post URL */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">Live Post URL</h2>
                <p className="text-xs text-gray-400 mb-2">Paste the live URL after publishing</p>
                <input
                  value={form.postUrl}
                  onChange={(e) => setForm((f) => ({ ...f, postUrl: e.target.value }))}
                  placeholder="https://instagram.com/p/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-teal-500 outline-none"
                />
                {form.postUrl && (
                  <a
                    href={form.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-teal-600 hover:underline"
                  >
                    Open link &rarr;
                  </a>
                )}
              </div>

              {/* Caption Preview */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Caption Preview</h2>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed max-h-60 overflow-y-auto">
                  {form.caption || <span className="text-gray-400 italic">No caption yet...</span>}
                  {form.hashtags && (
                    <div className="mt-2 text-teal-600">
                      {form.hashtags.split(',').map((h) => h.trim()).filter(Boolean).map((h) => `#${h.replace(/^#/, '')}`).join(' ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // List view
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
              <a href="/admin/articles" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">
                Articles
              </a>
              <span className="px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg">
                Social Posts
              </span>
              <a href="/admin/seo" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">
                SEO
              </a>
              <a href="/admin/prompt-library" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">
                Prompt Library
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">{posts.length} posts</span>
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
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none"
            >
              <option value="all">All Platforms</option>
              {platforms.map((p) => (
                <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-teal-500 outline-none"
            >
              <option value="all">All Status</option>
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button
              onClick={fetchPosts}
              className="px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          <button
            onClick={handleNew}
            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">📱</div>
            <p className="text-gray-500">No social posts yet</p>
            <p className="text-gray-400 text-sm mt-1">Create your first post to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => {
              const plat = getPlatformInfo(post.saikiweb_platform);
              const stat = getStatusInfo(post.saikiweb_status);
              return (
                <div
                  key={post.saikiweb_post_id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition group"
                >
                  {/* Card header */}
                  <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${plat.color}`}>
                        {plat.icon} {plat.label}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{post.saikiweb_post_type}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${stat.color}`}>
                      {stat.label}
                    </span>
                  </div>

                  {/* Caption preview */}
                  <div className="px-5 pb-3">
                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                      {post.saikiweb_caption}
                    </p>
                    {post.saikiweb_hashtags && post.saikiweb_hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.saikiweb_hashtags.slice(0, 5).map((h, i) => (
                          <span key={i} className="text-xs text-teal-600">#{h}</span>
                        ))}
                        {post.saikiweb_hashtags.length > 5 && (
                          <span className="text-xs text-gray-400">+{post.saikiweb_hashtags.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="uppercase">{post.saikiweb_locale}</span>
                      {post.saikiweb_article_slug && (
                        <span className="text-teal-500" title={`Linked: ${post.saikiweb_article_slug}`}>
                          🔗 article
                        </span>
                      )}
                      {post.saikiweb_scheduled_at && post.saikiweb_status === 'scheduled' && (
                        <span>📅 {formatDate(post.saikiweb_scheduled_at)}</span>
                      )}
                    </div>
                    <span>{formatDate(post.saikiweb_created_at)}</span>
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
                    >
                      Edit
                    </button>
                    {post.saikiweb_post_url && (
                      <a
                        href={post.saikiweb_post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                      >
                        View Live
                      </a>
                    )}
                    {deleteConfirm === post.saikiweb_post_id ? (
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-xs text-red-500">Delete?</span>
                        <button
                          onClick={() => handleDelete(post.saikiweb_post_id)}
                          className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(post.saikiweb_post_id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition ml-auto"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
