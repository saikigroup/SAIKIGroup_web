import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

interface SearchResult {
  type: 'page' | 'service' | 'article';
  title: string;
  description: string;
  url: string;
  category?: string;
}

// Static pages indexed for search (bilingual)
const staticPages: Record<string, SearchResult[]> = {
  id: [
    { type: 'page', title: 'Beranda', description: 'Halaman utama SAIKI Group — konsultansi, branding, dan teknologi.', url: '/id' },
    { type: 'page', title: 'Tentang SAIKI', description: 'Visi, misi, nilai, dan tim di balik SAIKI Group.', url: '/id/tentang' },
    { type: 'page', title: 'Layanan', description: 'Ekosistem layanan terintegrasi: Consultancy, Imagery, Technology.', url: '/id/layanan' },
    { type: 'page', title: 'Insights', description: 'Artikel, perspektif, dan pemikiran dari tim SAIKI.', url: '/id/insights' },
    { type: 'page', title: 'Proyek', description: 'Portfolio dan studi kasus proyek SAIKI Group.', url: '/id/proyek' },
    { type: 'page', title: 'Kontak', description: 'Hubungi SAIKI Group untuk konsultasi dan kolaborasi.', url: '/id/kontak' },
    { type: 'page', title: 'Kebijakan Privasi', description: 'Kebijakan privasi dan perlindungan data SAIKI Group.', url: '/id/privacy-policy' },
    { type: 'page', title: 'Syarat & Ketentuan', description: 'Syarat dan ketentuan penggunaan situs web SAIKI Group.', url: '/id/terms' },
    { type: 'service', title: 'SAIKI Consultancy', description: 'Konsultansi karier, pengembangan profesional, career coaching, dan career transition.', url: '/id/layanan/consultancy', category: 'Layanan' },
    { type: 'service', title: 'SAIKI Imagery', description: 'Branding, personal branding, identitas visual, desain logo, dan pemasaran digital.', url: '/id/layanan/imagery', category: 'Layanan' },
    { type: 'service', title: 'SAIKI Technology', description: 'Pengembangan software, aplikasi web, custom development, white-label, dan sistem bisnis.', url: '/id/layanan/technology', category: 'Layanan' },
  ],
  en: [
    { type: 'page', title: 'Home', description: 'SAIKI Group homepage — consultancy, branding, and technology.', url: '/en' },
    { type: 'page', title: 'About SAIKI', description: 'Vision, mission, values, and the team behind SAIKI Group.', url: '/en/about' },
    { type: 'page', title: 'Services', description: 'Integrated service ecosystem: Consultancy, Imagery, Technology.', url: '/en/services' },
    { type: 'page', title: 'Insights', description: 'Articles, perspectives, and thoughts from the SAIKI team.', url: '/en/insights' },
    { type: 'page', title: 'Projects', description: 'Portfolio and case studies of SAIKI Group projects.', url: '/en/projects' },
    { type: 'page', title: 'Contact', description: 'Contact SAIKI Group for consultation and collaboration.', url: '/en/contact' },
    { type: 'page', title: 'Privacy Policy', description: 'SAIKI Group privacy policy and data protection.', url: '/en/privacy-policy' },
    { type: 'page', title: 'Terms & Conditions', description: 'Terms and conditions for using the SAIKI Group website.', url: '/en/terms' },
    { type: 'service', title: 'SAIKI Consultancy', description: 'Career consultancy, professional development, career coaching, and career transition.', url: '/en/services/consultancy', category: 'Services' },
    { type: 'service', title: 'SAIKI Imagery', description: 'Branding, personal branding, visual identity, logo design, and digital marketing.', url: '/en/services/imagery', category: 'Services' },
    { type: 'service', title: 'SAIKI Technology', description: 'Software development, web applications, custom development, white-label, and business systems.', url: '/en/services/technology', category: 'Services' },
  ],
};

// Sanitize input for Supabase ilike filter
function sanitize(input: string): string {
  return input.replace(/[%_\\]/g, '\\$&');
}

function searchStatic(query: string, locale: string): SearchResult[] {
  const pages = staticPages[locale] || staticPages.id;
  const q = query.toLowerCase();
  return pages.filter(
    (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const locale = searchParams.get('locale') || 'id';

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, results: [] });
  }

  // Search static pages
  const staticResults = searchStatic(q, locale);

  // Search articles from DB
  const articleResults: SearchResult[] = [];
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data } = await supabase
        .from(TABLES.ARTICLES)
        .select('saikiweb_slug, saikiweb_title, saikiweb_excerpt, saikiweb_category, saikiweb_locale')
        .eq('saikiweb_published', true)
        .eq('saikiweb_locale', locale)
        .or(`saikiweb_title.ilike.%${sanitize(q)}%,saikiweb_excerpt.ilike.%${sanitize(q)}%`)
        .limit(10);

      if (data) {
        for (const a of data) {
          articleResults.push({
            type: 'article',
            title: a.saikiweb_title,
            description: a.saikiweb_excerpt,
            url: `/${a.saikiweb_locale}/insights/${a.saikiweb_slug}`,
            category: a.saikiweb_category,
          });
        }
      }
    } catch (err) {
      console.error('Search DB error:', err);
    }
  }

  // Merge: static first, then articles. Max 12 results.
  const results = [...staticResults, ...articleResults].slice(0, 12);

  return NextResponse.json({ success: true, results });
}
