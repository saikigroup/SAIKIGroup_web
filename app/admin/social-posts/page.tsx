'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LinkShortener } from '@/components/admin/LinkShortener';

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

// AI model prompt wrappers
const aiModels = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'claude', label: 'Claude' },
];

// Prompt types for social post generation
type PromptType = 'caption' | 'visual' | 'infographic';

const promptTypes: { value: PromptType; label: string; desc: string }[] = [
  { value: 'caption', label: 'Caption / Copy', desc: 'Caption siap paste ke platform' },
  { value: 'visual', label: 'Image Prompt', desc: 'Prompt siap paste ke AI image generator' },
  { value: 'infographic', label: 'Infographic', desc: 'Konten slide + image prompt per slide' },
];

function generateSocialPrompt(
  type: PromptType,
  platform: string,
  postType: string,
  article: { title: string; excerpt: string; slug: string; locale: string },
  ai: string,
  siteUrl: string,
  shortUrl?: string
): string {
  const longUtmUrl = buildUtmUrl(siteUrl, article.locale, article.slug, platform, postType);
  const utmUrl = shortUrl || longUtmUrl;
  const articleFullUrl = `${siteUrl}/${article.locale}/insights/${article.slug}`;
  const lang = article.locale === 'id' ? 'Bahasa Indonesia (casual, gunakan "kamu" bukan "Anda")' : 'English';
  const platLabel = platforms.find(p => p.value === platform)?.label || platform;

  const articleBlock = `ARTIKEL REFERENSI:
- Judul: "${article.title}"
- Ringkasan: "${article.excerpt}"
- Baca artikel lengkap di: ${articleFullUrl}
- Link untuk di-share (UTM tracking): ${utmUrl}`;

  // ═══════════════════════════════════════════════════
  // CAPTION — output: caption siap copas ke platform
  // ═══════════════════════════════════════════════════
  if (type === 'caption') {
    const captionRules: Record<string, string> = {
      instagram: postType === 'carousel'
        ? `FORMAT OUTPUT:
---CAPTION---
[Caption lengkap siap paste. Buka dengan hook 1 kalimat. Lalu jelaskan apa yang akan dipelajari di carousel ini. Akhiri dengan CTA (ajak swipe, save, share). Sertakan link: ${utmUrl}]

---SLIDE TEXT---
Slide 1 (Cover): [Headline hook, max 8 kata]
Slide 2: [Judul + 1-2 kalimat poin]
Slide 3: [Judul + 1-2 kalimat poin]
... (7-10 slide)
Slide terakhir: [CTA + "Link di bio" + SAIKI Group]

---HASHTAG---
[15-20 hashtag, campuran populer + niche, pisahkan dengan spasi]`
        : `FORMAT OUTPUT:
---CAPTION---
[Caption 150-300 kata siap paste. Hook di awal. Line breaks untuk readability. Emoji secukupnya. CTA di akhir. Sertakan link: ${utmUrl}]

---HASHTAG---
[15-20 hashtag]`,
      linkedin: postType === 'carousel'
        ? `FORMAT OUTPUT:
---POST TEXT---
[Post LinkedIn siap paste. Hook 1-2 baris. Lalu teaser isi carousel. Akhiri dengan pertanyaan terbuka. Sertakan link: ${utmUrl}]

---SLIDE TEXT---
Halaman 1 (Cover): [Judul + subtitle]
Halaman 2: [Heading + poin utama]
... (8-12 halaman)
Halaman terakhir: [Key takeaways + CTA]

---HASHTAG---
[3-5 hashtag profesional]`
        : `FORMAT OUTPUT:
---POST---
[Post LinkedIn 200-400 kata siap paste. Hook personal/data. Paragraf pendek. Personal insight. Pertanyaan terbuka di akhir. Link: ${utmUrl}]

---HASHTAG---
[3-5 hashtag]`,
      tiktok: postType === 'reel'
        ? `FORMAT OUTPUT:
---SCRIPT VIDEO---
[00:00-00:03] Hook: [kalimat hook]
[00:03-00:15] Masalah: [narasi]
[00:15-00:40] Insight: [poin-poin]
[00:40-00:55] Solusi: [wrap up]
[00:55-01:00] CTA: "Follow untuk tips lainnya!"

---CAPTION---
[Caption pendek 50-100 kata + link di bio]

---HASHTAG---
[5-8 hashtag trending + niche]`
        : `FORMAT OUTPUT:
---CAPTION---
[Caption pendek 50-100 kata, super casual]

---HASHTAG---
[5-8 hashtag]`,
      twitter: `FORMAT OUTPUT:
---THREAD---
Tweet 1: [Hook max 280 karakter, bikin penasaran]
Tweet 2: [Insight 1]
Tweet 3: [Insight 2]
Tweet 4: [Insight 3]
Tweet 5: [Insight 4]
Tweet 6: [CTA + link: ${utmUrl}]

---HASHTAG---
[2-3 hashtag per tweet]`,
      facebook: postType === 'reel'
        ? `FORMAT OUTPUT:
---SCRIPT VIDEO---
[Scene-by-scene script 30-60 detik]

---CAPTION---
[Caption warm + link: ${utmUrl}]

---HASHTAG---
[3-5 hashtag]`
        : `FORMAT OUTPUT:
---POST---
[Post 150-300 kata. Storytelling. Warm. Link: ${utmUrl}. Pertanyaan di akhir.]

---HASHTAG---
[3-5 hashtag]`,
    };

    return `Baca artikel ini dulu: ${articleFullUrl}

${articleBlock}

Sekarang TULIS LANGSUNG caption/post untuk ${platLabel} ${postType} berdasarkan artikel di atas.

BAHASA: ${lang}
TONE: ${platform === 'linkedin' ? 'Professional tapi approachable' : platform === 'tiktok' ? 'Super casual, kayak ngomong ke teman' : platform === 'twitter' ? 'Sharp, witty, concise' : 'Conversational, relatable'}

ATURAN:
- JANGAN copy-paste isi artikel. Buat orang PENASARAN untuk klik
- JANGAN tulis penjelasan, instruksi, atau komentar. LANGSUNG output yang siap pakai
- JANGAN gunakan emdash (--)
- Emoji secukupnya sebagai visual cue

${captionRules[platform] || captionRules.instagram}`;
  }

  // ═══════════════════════════════════════════════════
  // VISUAL — Gemini/ChatGPT: langsung generate gambar
  //          Claude/lainnya: output prompt untuk tools lain
  // ═══════════════════════════════════════════════════
  if (type === 'visual') {
    const aspectRatio: Record<string, string> = {
      instagram: postType === 'reel' ? '9:16 (1080x1920px)' : '1:1 (1080x1080px)',
      linkedin: postType === 'carousel' ? '4:5 (PDF)' : '1.91:1 (1200x627px)',
      tiktok: '9:16 (1080x1920px)',
      twitter: '16:9 (1200x675px)',
      facebook: postType === 'reel' ? '9:16' : '1:1',
    };
    const ratio = aspectRatio[platform] || '1:1';
    const canGenerate = ai === 'gemini' || ai === 'chatgpt';
    const slideCountVisual = platform === 'linkedin' ? '8-12' : '7-10';

    const brandBlock = `BRAND: SAIKI Group
- Warna utama: Teal (#0d9488), Violet (#8b5cf6)
- Background: Dark (#0f172a) atau gradient teal gelap
- Accent: Cyan (#06b6d4)
- Font style: Modern sans-serif (Montserrat/Inter), bold headlines
- Logo text: "SAIKI Group" di slide terakhir`;

    if (canGenerate) {
      // Gemini & ChatGPT — langsung suruh generate gambar
      if (postType === 'carousel') {
        return `Baca artikel ini dulu: ${articleFullUrl}

${articleBlock}

Sekarang GENERATE ${slideCountVisual} gambar untuk carousel ${platLabel} berdasarkan artikel di atas.

${brandBlock}
ASPECT RATIO: ${ratio}
BAHASA TEKS DI GAMBAR: ${lang}

INSTRUKSI:
Generate satu per satu, ${slideCountVisual} gambar dengan urutan:

1. SLIDE COVER — Background gradient teal ke dark. Headline besar (max 8 kata) yang bikin stop scrolling. Subtitle kecil di bawah. Style: modern flat infographic.

2-${slideCountVisual === '8-12' ? '11' : '9'}. SLIDE KONTEN — Masing-masing 1 poin insight dari artikel. Heading besar (max 5 kata) + body text singkat (max 25 kata) + ikon/ilustrasi flat. Background konsisten. Visual hierarchy jelas.

${slideCountVisual === '8-12' ? '12' : '10'}. SLIDE CTA — Text: "Baca Selengkapnya" + link artikel + "SAIKI Group". Background brand teal.

ATURAN:
- LANGSUNG generate gambarnya, jangan tulis deskripsi/outline
- Ambil insight dari artikel, jangan buat generik
- Setiap slide harus readable di mobile (font besar, teks singkat)
- Konsisten style, warna, dan layout antar slide
- Teks di gambar dalam ${lang}`;
      }

      return `Baca artikel ini dulu: ${articleFullUrl}

${articleBlock}

Sekarang GENERATE 1 gambar untuk ${platLabel} ${postType} berdasarkan artikel di atas.

${brandBlock}
ASPECT RATIO: ${ratio}
BAHASA TEKS DI GAMBAR: ${lang}

INSTRUKSI:
Generate gambar dengan:
- Text overlay: headline singkat (max 10 kata) yang merangkum insight utama artikel
- Background: gradient teal (#0d9488) ke dark (#0f172a)
- Style: modern editorial, clean, professional
- Elemen dekoratif: geometric shapes atau ikon relevan
- "SAIKI Group" kecil di corner

ATURAN:
- LANGSUNG generate gambarnya, jangan tulis deskripsi/prompt
- Teks di gambar dalam ${lang}`;
    }

    // Claude & lainnya — output prompt untuk Midjourney/DALL-E/dll
    if (postType === 'carousel') {
      return `Baca artikel ini dulu: ${articleFullUrl}

${articleBlock}

Buat ${slideCountVisual} IMAGE PROMPTS siap paste ke Midjourney/DALL-E untuk carousel ${platLabel}.

${brandBlock}
ASPECT RATIO: ${ratio}
BAHASA TEKS DI GAMBAR: ${lang}

FORMAT OUTPUT (langsung, tanpa penjelasan):

---SLIDE 1 (Cover)---
Text di gambar: [headline hook, max 8 kata]
Image prompt: [prompt bahasa Inggris. Detail: layout, background (gradient teal #0d9488 to dark #0f172a), typography (bold sans-serif), decorative elements. Include "text reads: [exact text in ${article.locale === 'id' ? 'Indonesian' : 'English'}]". Style: modern flat design infographic, 1080x1080.]

---SLIDE 2---
Text di gambar: [judul + 1 poin singkat]
Image prompt: [prompt lengkap]

... (lanjutkan semua slide)

---SLIDE TERAKHIR (CTA)---
Text di gambar: [CTA + "SAIKI Group"]
Image prompt: [prompt lengkap]

ATURAN:
- Setiap prompt LENGKAP dan BERDIRI SENDIRI (siap paste)
- Konsisten style antar slide
- JANGAN tulis penjelasan. LANGSUNG prompt-nya`;
    }

    return `Baca artikel ini dulu: ${articleFullUrl}

${articleBlock}

Buat 1 IMAGE PROMPT siap paste ke Midjourney/DALL-E untuk ${platLabel} ${postType}.

${brandBlock}
ASPECT RATIO: ${ratio}
BAHASA TEKS DI GAMBAR: ${lang}

FORMAT OUTPUT (langsung):

---IMAGE---
Text di gambar: [max 10 kata]
Image prompt: [prompt bahasa Inggris. Detail: subject, composition, background (gradient teal #0d9488 to dark #0f172a), typography, mood. Include "text overlay reads: [exact text]". Style: modern editorial, clean, professional.]

ATURAN:
- Prompt LENGKAP dan siap paste langsung
- JANGAN tulis brief/penjelasan. LANGSUNG prompt-nya`;
  }

  // ═══════════════════════════════════════════════════
  // INFOGRAPHIC — Gemini/ChatGPT: langsung generate
  //               Claude/lainnya: konten + prompt
  // ═══════════════════════════════════════════════════
  const slideCount = platform === 'linkedin' ? '8-12' : platform === 'twitter' ? '1' : postType === 'carousel' ? '7-10' : '5-7';
  const aspectRatioInfographic: Record<string, string> = {
    instagram: '1:1 (1080x1080px)',
    linkedin: '4:5',
    tiktok: '9:16',
    twitter: '16:9',
    facebook: '1:1',
  };
  const ratio = aspectRatioInfographic[platform] || '1:1';
  const canGenerate = ai === 'gemini' || ai === 'chatgpt';

  const brandBlock = `BRAND: SAIKI Group
- Warna utama: Teal (#0d9488), Violet (#8b5cf6)
- Background: Dark (#0f172a) atau Light (#f0fdfa), bisa gradient
- Accent: Cyan (#06b6d4)
- Font: Modern sans-serif (Montserrat/Inter), bold headlines
- Logo: "SAIKI Group" di slide terakhir`;

  if (canGenerate) {
    return `Baca artikel ini dulu: ${articleFullUrl}

${articleBlock}

Sekarang GENERATE ${slideCount} gambar infographic untuk ${platLabel} berdasarkan artikel di atas.

${brandBlock}
ASPECT RATIO: ${ratio}
BAHASA TEKS DI GAMBAR: ${lang}

INSTRUKSI:
Generate satu per satu:

1. SLIDE COVER
- Background: gradient teal ke dark
- Headline besar (max 8 kata): hook yang bikin swipe
- Subtitle kecil (opsional)
- Style: modern flat design infographic

2-${slideCount === '8-12' ? '11' : slideCount === '1' ? '1' : (parseInt(slideCount.split('-')[1] || slideCount) - 1).toString()}. SLIDE KONTEN
- Masing-masing 1 poin/insight dari artikel
- Heading besar (max 5 kata) + body singkat (max 25 kata)
- Ikon atau ilustrasi flat yang relevan
- Data/statistik dari artikel jika ada
- Konsisten layout antar slide

${slideCount !== '1' ? `${slideCount === '8-12' ? '12' : slideCount.split('-')[1] || slideCount}. SLIDE CTA
- "Baca Selengkapnya" + link artikel
- "SAIKI Group" branding
- Background brand teal solid` : ''}

ATURAN:
- LANGSUNG generate gambarnya satu per satu, JANGAN tulis outline/deskripsi
- AMBIL insight dan data langsung dari artikel
- Setiap slide readable di mobile (font besar, teks singkat, max 30 kata)
- Visual hierarchy: heading besar > body kecil > ikon pendukung
- Konsisten style, warna, dan layout
- Teks di gambar dalam ${lang}`;
  }

  // Claude & lainnya — konten + prompt per slide
  return `Baca artikel ini dulu: ${articleFullUrl}

${articleBlock}

Buat ${slideCount} INFOGRAPHIC SLIDES untuk ${platLabel}. Per slide: konten final + image prompt siap paste ke Midjourney/DALL-E.

${brandBlock}
ASPECT RATIO: ${ratio}
BAHASA TEKS DI GAMBAR: ${lang}

FORMAT OUTPUT (langsung per slide, TANPA penjelasan):

---SLIDE 1 (Cover)---
Headline: [max 8 kata, hook]
Subheadline: [opsional]
Image prompt: [Prompt bahasa Inggris. Describe: infographic cover, exact text, layout, background (gradient teal to dark), bold sans-serif typography, geometric decorations. Style: modern flat design infographic.]

---SLIDE 2---
Heading: [max 5 kata]
Body: [1-2 kalimat, max 25 kata]
Icon: [ikon relevan]
Image prompt: [Prompt lengkap]

... (lanjutkan semua slide)

---SLIDE TERAKHIR (CTA)---
Heading: "Baca Selengkapnya"
Body: [link artikel + "SAIKI Group"]
Image prompt: [Prompt lengkap]

ATURAN:
- AMBIL insight langsung dari artikel
- Setiap slide max 30 kata teks
- Setiap image prompt LENGKAP dan BERDIRI SENDIRI
- JANGAN tulis outline. LANGSUNG konten + prompt siap pakai
- Konsisten style antar slide`;
}

// UTM URL builder for tracking article shares per platform
function buildUtmUrl(siteUrl: string, locale: string, slug: string, platform: string, postType: string): string {
  const base = `${siteUrl}/${locale}/insights/${slug}`;
  const params = new URLSearchParams({
    utm_source: platform,
    utm_medium: 'social',
    utm_campaign: `article_share_${slug}`,
    utm_content: postType,
  });
  return `${base}?${params.toString()}`;
}



export default function AdminSocialPostsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <SocialPostsContent />
    </Suspense>
  );
}

function SocialPostsContent() {
  const searchParams = useSearchParams();
  const shareSlug = searchParams.get('share');
  const hasAutoOpened = useRef(false);

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
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [promptCopied, setPromptCopied] = useState(false);
  const [articleCtaLink, setArticleCtaLink] = useState('');
  const [selectedPromptType, setSelectedPromptType] = useState<PromptType>('caption');
  const [selectedAi, setSelectedAi] = useState('chatgpt');
  const [shortenedUtmUrl, setShortenedUtmUrl] = useState('');
  const [utmShortening, setUtmShortening] = useState(false);
  const [utmShortenError, setUtmShortenError] = useState('');

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

  // Auto-open editor when ?share= param is present
  useEffect(() => {
    if (shareSlug && authenticated && articles.length > 0 && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      const article = articles.find((a) => a.saikiweb_slug === shareSlug);
      if (article) {
        setForm({
          ...emptyForm,
          articleSlug: article.saikiweb_slug,
          locale: article.saikiweb_locale,
          categoryKey: article.saikiweb_category_key || 'general',
        });
        setEditingId(null);
        setEditing(true);
      }
    }
  }, [shareSlug, authenticated, articles]);

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
                        setShortenedUtmUrl('');
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
                      onClick={() => { setForm((f) => ({ ...f, postType: t.value })); setShortenedUtmUrl(''); }}
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

              {/* Prompt Library */}
              {form.articleSlug && (() => {
                const linked = articles.find((a) => a.saikiweb_slug === form.articleSlug);
                if (!linked) return null;
                return (
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 p-6">
                    <h2 className="text-sm font-semibold text-teal-900 mb-1">Prompt Library</h2>
                    <p className="text-xs text-teal-600 mb-4">Generate AI prompt untuk {platforms.find(p => p.value === form.platform)?.label} content</p>

                    {/* AI Model selector */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-teal-700 font-medium">AI:</span>
                      {aiModels.map((m) => (
                        <button
                          key={m.value}
                          onClick={() => setSelectedAi(m.value)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                            selectedAi === m.value ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {/* Prompt type tabs */}
                    <div className="flex gap-1 mb-4">
                      {promptTypes.map((pt) => (
                        <button
                          key={pt.value}
                          onClick={() => { setSelectedPromptType(pt.value); setGeneratedPrompt(''); setPromptCopied(false); }}
                          className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition ${
                            selectedPromptType === pt.value
                              ? 'bg-teal-600 text-white'
                              : 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50'
                          }`}
                        >
                          <span className="block">{pt.label}</span>
                          <span className={`block text-[10px] mt-0.5 ${selectedPromptType === pt.value ? 'text-teal-100' : 'text-teal-400'}`}>{pt.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Generate button */}
                    <button
                      onClick={() => {
                        const prompt = generateSocialPrompt(
                          selectedPromptType,
                          form.platform,
                          form.postType,
                          { title: linked.saikiweb_title, excerpt: linked.saikiweb_excerpt, slug: linked.saikiweb_slug, locale: linked.saikiweb_locale },
                          selectedAi,
                          'https://saiki.id',
                          shortenedUtmUrl || undefined
                        );
                        setGeneratedPrompt(prompt);
                        setPromptCopied(false);
                      }}
                      className="w-full py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition"
                    >
                      Generate {promptTypes.find(pt => pt.value === selectedPromptType)?.label} Prompt
                    </button>

                    {/* Generated output */}
                    {generatedPrompt && (
                      <div className="mt-4">
                        <div className="bg-white rounded-xl p-4 max-h-56 overflow-y-auto">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{generatedPrompt}</pre>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={async () => {
                              await navigator.clipboard.writeText(generatedPrompt);
                              setPromptCopied(true);
                              setTimeout(() => setPromptCopied(false), 2000);
                            }}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                              promptCopied ? 'bg-green-100 text-green-700' : 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50'
                            }`}
                          >
                            {promptCopied ? 'Copied!' : 'Copy Prompt'}
                          </button>
                          <span className="text-xs text-teal-500">
                            Paste ke {aiModels.find(m => m.value === selectedAi)?.label}, lalu paste hasilnya
                          </span>
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
                    setShortenedUtmUrl('');
                    setUtmShortenError('');
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

              {/* UTM Tracked Link */}
              {form.articleSlug && (() => {
                const linked = articles.find((a) => a.saikiweb_slug === form.articleSlug);
                if (!linked) return null;
                const utmUrl = buildUtmUrl('https://saiki.id', linked.saikiweb_locale, linked.saikiweb_slug, form.platform, form.postType);
                const displayUrl = shortenedUtmUrl || utmUrl;
                const handleShortenUtm = async () => {
                  setUtmShortening(true);
                  setUtmShortenError('');
                  try {
                    const res = await fetch('/api/admin/shorten', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
                      body: JSON.stringify({ url: utmUrl }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setShortenedUtmUrl(data.shortLink);
                    } else {
                      setUtmShortenError(data.error || 'Failed to shorten');
                    }
                  } catch {
                    setUtmShortenError('Network error');
                  }
                  setUtmShortening(false);
                };
                return (
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
                    <h2 className="text-sm font-semibold text-amber-900 mb-2">UTM Tracked Link</h2>
                    <p className="text-xs text-amber-600 mb-2">Gunakan link ini di caption agar bisa di-track di analytics</p>

                    {/* Short link (if available) */}
                    {shortenedUtmUrl && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-green-700">Short link:</span>
                          <code className="text-sm font-semibold text-green-800 break-all">{shortenedUtmUrl}</code>
                        </div>
                      </div>
                    )}

                    {/* Full UTM link */}
                    <div className="bg-white rounded-lg p-3 border border-amber-100">
                      <code className="text-xs text-gray-700 break-all leading-relaxed">{utmUrl}</code>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={async () => { await navigator.clipboard.writeText(displayUrl); }}
                        className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-white border border-amber-200 rounded-lg hover:bg-amber-100 transition"
                      >
                        Copy {shortenedUtmUrl ? 'Short' : 'UTM'} Link
                      </button>
                      {!shortenedUtmUrl && (
                        <button
                          onClick={handleShortenUtm}
                          disabled={utmShortening}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition disabled:opacity-40"
                        >
                          {utmShortening ? 'Shortening...' : 'Shorten → s.saiki.id'}
                        </button>
                      )}
                    </div>
                    {utmShortenError && <p className="text-xs text-red-500 mt-1">{utmShortenError}</p>}

                    <div className="mt-3 text-xs text-amber-500 space-y-0.5">
                      <p>utm_source: <span className="font-mono text-amber-700">{form.platform}</span></p>
                      <p>utm_medium: <span className="font-mono text-amber-700">social</span></p>
                      <p>utm_campaign: <span className="font-mono text-amber-700">article_share_{linked.saikiweb_slug}</span></p>
                      <p>utm_content: <span className="font-mono text-amber-700">{form.postType}</span></p>
                    </div>
                  </div>
                );
              })()}

              {/* Article CTA Link Shortener */}
              <LinkShortener
                value={articleCtaLink}
                onChange={setArticleCtaLink}
                password={password}
                label="Article Link (untuk caption)"
                placeholder="https://saiki.id/id/insights/artikel-slug"
                helpText="Buat short link untuk ditempel di caption/bio. UTM tracking tetap jalan."
              />

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">SAIKI Admin</h1>
            </div>
            <nav className="flex items-center gap-1 overflow-x-auto max-w-full">
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
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition">
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
