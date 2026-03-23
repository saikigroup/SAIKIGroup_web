'use client';

import { useState, useEffect } from 'react';

const aiModels = [
  { value: 'chatgpt', label: 'ChatGPT (OpenAI)', icon: 'G' },
  { value: 'gemini', label: 'Gemini (Google)', icon: 'G' },
  { value: 'claude', label: 'Claude (Anthropic)', icon: 'C' },
];

const categoryOptions = [
  { value: 'consultancy', labelId: 'Karier', labelEn: 'Career' },
  { value: 'imagery', labelId: 'Branding', labelEn: 'Branding' },
  { value: 'technology', labelId: 'Teknologi', labelEn: 'Technology' },
];

const toneOptions = [
  { value: 'conversational', label: 'Conversational', desc: 'Santai, seperti ngobrol dengan teman yang expert' },
  { value: 'professional', label: 'Professional', desc: 'Formal tapi tetap approachable' },
  { value: 'storytelling', label: 'Storytelling', desc: 'Naratif, banyak cerita dan analogi' },
  { value: 'educational', label: 'Educational', desc: 'Edukatif, step-by-step, banyak contoh' },
  { value: 'provocative', label: 'Provocative', desc: 'Menantang asumsi, bikin mikir' },
];

const lengthOptions = [
  { value: 'short', label: 'Pendek (800-1200 kata)', wordCount: '800-1200' },
  { value: 'medium', label: 'Sedang (1500-2000 kata)', wordCount: '1500-2000' },
  { value: 'long', label: 'Panjang (2500-3500 kata)', wordCount: '2500-3500' },
];

const localeOptions = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' },
  { value: 'both', label: 'Keduanya (ID + EN)' },
];

function generatePrompt(config: {
  ai: string;
  topic: string;
  category: string;
  tone: string;
  length: string;
  locale: string;
  audience: string;
  keyPoints: string;
  avoidTopics: string;
  cta: string;
}): string {
  const cat = categoryOptions.find((c) => c.value === config.category);
  const toneObj = toneOptions.find((t) => t.value === config.tone);
  const lengthObj = lengthOptions.find((l) => l.value === config.length);

  const localeName = config.locale === 'id' ? 'Bahasa Indonesia'
    : config.locale === 'en' ? 'English'
    : 'both Bahasa Indonesia AND English (write two separate versions)';

  const categoryName = config.locale === 'en'
    ? (cat?.labelEn || config.category)
    : (cat?.labelId || config.category);

  const keyPointsList = config.keyPoints
    ? config.keyPoints.split('\n').filter(Boolean).map((p) => `- ${p.trim()}`).join('\n')
    : '';

  const basePrompt = `You are a professional content writer for SAIKI Group, an integrated ecosystem providing career consultancy, branding & marketing, and technology development services based in Indonesia.

Write an article about: "${config.topic}"

Category: ${categoryName} (${cat?.value || config.category})
Target audience: ${config.audience || 'Professionals and business owners in Indonesia'}
Tone: ${toneObj?.label || config.tone} (${toneObj?.desc || ''})
Word count: ${lengthObj?.wordCount || '1500-2000'} words
Language: ${localeName}

IMPORTANT FORMATTING RULES:
1. Output the article body as clean HTML using ONLY these tags:
   - <p> for paragraphs
   - <h2> for main section headings
   - <h3> for sub-headings (use sparingly)
   - <blockquote><p>...</p></blockquote> for pull quotes / highlighted statements (use 2-3 per article to break up text visually)
   - <ul> and <ol> with <li> for lists
   - <strong> for bold emphasis
   - <em> for italic emphasis
   - <hr> for section dividers (use sparingly)
2. Do NOT use any other HTML tags (no <div>, <span>, <img>, <table>, etc.)
3. Do NOT use markdown formatting
4. Do NOT use emdashes (--) anywhere in the text. Use commas, periods, or restructure sentences instead
5. Use "kamu" instead of "Anda" for Indonesian articles (casual, approachable tone)
6. Each paragraph should be wrapped in <p> tags
7. Start the article with a compelling opening paragraph (no heading before it)
8. Use <blockquote> for impactful statements that deserve visual emphasis

CONTENT GUIDELINES:
- Write from SAIKI Group's perspective as industry experts
- ALL information must be factually accurate and verifiable. Do NOT make up statistics, studies, or claims. If referencing data, use real sources
- Include practical, actionable advice with real-world examples
- Offer a fresh, unconventional perspective. Challenge common assumptions. Do NOT write generic advice that could be found on any blog
- The writing must sound completely human. Vary sentence length naturally. Use conversational transitions. Include occasional rhetorical questions. Add personal observations. AVOID: repetitive sentence structures, overly formal phrasing, "in conclusion", "it is important to note", "furthermore", "in today's world", or any other AI-sounding patterns
- NEVER use emdashes (--) anywhere. Use commas, periods, colons, or restructure the sentence
- Make it insightful and worth reading, not just informative. Every paragraph should either teach something, challenge something, or make the reader think differently
- The first paragraph should hook the reader immediately with a story, scenario, or provocative statement
- Write as if you are having a smart conversation with the reader, not lecturing them${keyPointsList ? `\n\nKey points to cover:\n${keyPointsList}` : ''}${config.avoidTopics ? `\n\nTopics/words to AVOID: ${config.avoidTopics}` : ''}${config.cta ? `\n\nEnd with a call-to-action related to: ${config.cta}` : ''}

ALSO PROVIDE (outside the HTML body, clearly labeled):
1. **Title**: A compelling, SEO-friendly article title (max 70 characters)
2. **Slug**: URL-friendly slug in lowercase with hyphens${config.locale === 'id' ? ' (in Indonesian)' : config.locale === 'en' ? ' (in English)' : ' (one for each language)'}
3. **Excerpt**: A 1-2 sentence teaser that makes people want to click (max 160 characters)
4. **Meta Title**: SEO-optimized title ending with "| SAIKI" (max 60 characters)
5. **Meta Description**: Search-result description with keywords and CTA (max 160 characters)
6. **Keywords**: 5-7 comma-separated SEO keywords
7. **Read Time**: Estimated reading time`;

  if (config.locale === 'both') {
    return basePrompt + `

DUAL LANGUAGE OUTPUT:
Write TWO complete versions of the article:
1. First the Indonesian (ID) version with all metadata
2. Then the English (EN) version with all metadata
Clearly separate them with "--- INDONESIAN VERSION ---" and "--- ENGLISH VERSION ---"
The content should be adapted (not just translated) for each language's audience.`;
  }

  return basePrompt;
}

export default function PromptLibraryPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [ai, setAi] = useState('chatgpt');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('consultancy');
  const [tone, setTone] = useState('conversational');
  const [length, setLength] = useState('medium');
  const [locale, setLocale] = useState('id');
  const [audience, setAudience] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [avoidTopics, setAvoidTopics] = useState('');
  const [cta, setCta] = useState('');

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

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

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const prompt = generatePrompt({ ai, topic, category, tone, length, locale, audience, keyPoints, avoidTopics, cta });
    setGeneratedPrompt(prompt);
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <a href="/admin" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">Inquiries</a>
              <a href="/admin/articles" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">Articles</a>
              <a href="/admin/social-posts" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">Social Posts</a>
              <a href="/admin/seo" className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition">SEO</a>
              <span className="px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg">Prompt Library</span>
            </nav>
          </div>
          <button onClick={() => { sessionStorage.removeItem('admin_pw'); setAuthenticated(false); setPassword(''); }} className="text-sm text-gray-500 hover:text-red-600 transition">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">AI Prompt Generator</h2>
          <p className="text-sm text-gray-500 mt-1">Buat prompt yang sudah dioptimalkan untuk generate artikel SAIKI. Hasil dari AI tinggal copy-paste ke article editor.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Config panel */}
          <div className="space-y-5">
            {/* AI Model */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AI Model</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {aiModels.map((model) => (
                  <button
                    key={model.value}
                    onClick={() => setAi(model.value)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition border ${
                      ai === model.value
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {model.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Topik Artikel *</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Cara membangun personal brand di LinkedIn untuk fresh graduate"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none transition"
              />
            </div>

            {/* Category + Locale */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none">
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>{c.labelId} / {c.labelEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bahasa</label>
                  <select value={locale} onChange={(e) => setLocale(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none">
                    {localeOptions.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tone + Length */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tone</label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none">
                    {toneOptions.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">{toneOptions.find((t) => t.value === tone)?.desc}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Panjang</label>
                  <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none">
                    {lengthOptions.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Contoh: Fresh graduate yang mau masuk industri tech"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">Opsional. Default: Professionals and business owners in Indonesia</p>
            </div>

            {/* Key Points */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Poin-poin yang Harus Dibahas</label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder={"Satu poin per baris. Contoh:\nPentingnya foto profil profesional\nCara menulis headline LinkedIn\nOptimasi keyword di About section"}
                rows={4}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Opsional. Satu poin per baris.</p>
            </div>

            {/* Avoid Topics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Yang Harus Dihindari</label>
                  <input
                    type="text"
                    value={avoidTopics}
                    onChange={(e) => setAvoidTopics(e.target.value)}
                    placeholder="Contoh: jargon teknis, emdash"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Call-to-Action</label>
                  <input
                    type="text"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="Contoh: Konsultasi gratis di SAIKI"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-teal-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!topic.trim()}
              className="w-full py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              Generate Prompt
            </button>
          </div>

          {/* Output panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Generated Prompt</h3>
                  {generatedPrompt && (
                    <p className="text-xs text-gray-400 mt-0.5">{generatedPrompt.length} characters</p>
                  )}
                </div>
                {generatedPrompt && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                        copied
                          ? 'bg-green-100 text-green-700'
                          : 'bg-teal-600 text-white hover:bg-teal-700'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy Prompt'}
                    </button>
                  </div>
                )}
              </div>

              {generatedPrompt ? (
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans">
                    {generatedPrompt}
                  </pre>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Isi form di kiri, lalu klik Generate Prompt</p>
                  <p className="text-gray-300 text-xs mt-2">Prompt yang dihasilkan sudah dioptimalkan supaya output AI langsung bisa di-paste ke article editor</p>
                </div>
              )}

              {generatedPrompt && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cara Pakai</h4>
                  <ol className="text-xs text-gray-500 space-y-1.5">
                    <li className="flex gap-2">
                      <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-md flex items-center justify-center font-bold shrink-0">1</span>
                      <span>Copy prompt di atas</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-md flex items-center justify-center font-bold shrink-0">2</span>
                      <span>Paste ke {aiModels.find((m) => m.value === ai)?.label || 'AI'}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-md flex items-center justify-center font-bold shrink-0">3</span>
                      <span>Copy hasil HTML body dari AI</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-md flex items-center justify-center font-bold shrink-0">4</span>
                      <span>Paste ke <a href="/admin/articles" className="text-teal-600 hover:underline font-medium">Article Editor</a> (tab Visual Editor atau HTML Code)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-5 h-5 bg-teal-100 text-teal-700 rounded-md flex items-center justify-center font-bold shrink-0">5</span>
                      <span>Isi metadata (title, slug, SEO) dari output AI ke sidebar fields</span>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
