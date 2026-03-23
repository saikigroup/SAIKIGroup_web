'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Briefcase, BookOpen, X } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

interface SearchResult {
  type: 'page' | 'service' | 'article';
  title: string;
  description: string;
  url: string;
  category?: string;
}

const typeIcons = {
  page: FileText,
  service: Briefcase,
  article: BookOpen,
};

const typeLabels: Record<string, Record<string, string>> = {
  id: { page: 'Halaman', service: 'Layanan', article: 'Artikel' },
  en: { page: 'Page', service: 'Service', article: 'Article' },
};

interface SearchDialogProps {
  locale: Locale;
  placeholder?: string;
}

export function SearchDialog({ locale, placeholder }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Debounced search
  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${locale}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
        setSelectedIndex(0);
      }
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, [locale]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 250);
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    router.push(result.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const labels = typeLabels[locale] || typeLabels.id;
  const searchPlaceholder = placeholder || (locale === 'id' ? 'Cari halaman, layanan, artikel...' : 'Search pages, services, articles...');

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg hover:bg-brand-teal/5 transition-colors text-brand-black/60 hover:text-brand-teal"
        aria-label="Search"
      >
        <Search className="w-4.5 h-4.5" />
      </button>

      {/* Dialog overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-w-xl mx-auto mt-[15vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={() => { setQuery(''); setResults([]); }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 rounded border border-gray-200">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto">
                {loading && (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">
                    {locale === 'id' ? 'Mencari...' : 'Searching...'}
                  </div>
                )}

                {!loading && query.length >= 2 && results.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-gray-500">
                      {locale === 'id' ? 'Tidak ada hasil untuk' : 'No results for'} &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {locale === 'id' ? 'Coba keyword lain' : 'Try different keywords'}
                    </p>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <ul className="py-2">
                    {results.map((result, i) => {
                      const Icon = typeIcons[result.type] || FileText;
                      return (
                        <li key={`${result.url}-${i}`}>
                          <button
                            onClick={() => handleSelect(result)}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={`w-full flex items-start gap-3 px-5 py-3 text-left transition-colors ${
                              i === selectedIndex ? 'bg-teal-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              result.type === 'article' ? 'bg-violet-100 text-violet-600' :
                              result.type === 'service' ? 'bg-teal-100 text-teal-600' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 truncate">{result.title}</span>
                                <span className="text-[10px] text-gray-400 font-medium uppercase shrink-0">
                                  {labels[result.type]}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{result.description}</p>
                              {result.category && (
                                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                                  {result.category}
                                </span>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {!loading && query.length < 2 && (
                  <div className="px-5 py-6 text-center text-xs text-gray-400">
                    {locale === 'id' ? 'Ketik minimal 2 karakter untuk mencari' : 'Type at least 2 characters to search'}
                    <div className="mt-2 flex items-center justify-center gap-3 text-gray-300">
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">↑↓</kbd>
                        {locale === 'id' ? 'navigasi' : 'navigate'}
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">↵</kbd>
                        {locale === 'id' ? 'pilih' : 'select'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
