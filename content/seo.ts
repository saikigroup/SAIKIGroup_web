import type { Locale } from '@/lib/i18n';

type PageSeo = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
};

type SeoMap = Record<string, Record<Locale, PageSeo>>;

export const seoData: SeoMap = {
  home: {
    id: {
      title: 'SAIKI Group | Konsultansi, Branding & Teknologi',
      description: 'SAIKI Group adalah ekosistem terintegrasi untuk konsultansi karier, branding & pemasaran, dan pengembangan teknologi. Bergerak sekarang.',
      ogTitle: 'SAIKI Group | Bergerak Sekarang',
      ogDescription: 'Konsultansi karier, branding, dan teknologi dalam satu ekosistem.',
      keywords: ['konsultansi karier', 'branding', 'teknologi', 'SAIKI Group', 'pengembangan bisnis', 'pemasaran digital', 'software development'],
    },
    en: {
      title: 'SAIKI Group | Consultancy, Branding & Technology',
      description: 'SAIKI Group is an integrated ecosystem for career consultancy, branding & marketing, and technology development. Move now.',
      ogTitle: 'SAIKI Group | Move Now',
      ogDescription: 'Career consultancy, branding, and technology in one ecosystem.',
      keywords: ['career consultancy', 'branding', 'technology', 'SAIKI Group', 'business development', 'digital marketing', 'software development'],
    },
  },
  about: {
    id: {
      title: 'Tentang SAIKI | Dibangun untuk Masa Kini',
      description: 'Pelajari bagaimana SAIKI Group menggabungkan konsultansi, branding, dan teknologi dalam satu ekosistem yang terintegrasi.',
      keywords: ['tentang SAIKI', 'profil perusahaan', 'ekosistem bisnis', 'konsultansi Indonesia'],
    },
    en: {
      title: 'About SAIKI | Built for the Present',
      description: 'Learn how SAIKI Group combines consultancy, branding, and technology in one integrated ecosystem.',
      keywords: ['about SAIKI', 'company profile', 'business ecosystem', 'Indonesia consultancy'],
    },
  },
  services: {
    id: {
      title: 'Layanan SAIKI | Konsultansi, Imagery, Technology',
      description: 'Solusi lengkap dari SAIKI: konsultansi karier, branding & pemasaran, dan pengembangan software. Temukan solusi yang tepat untuk kebutuhan Anda.',
      keywords: ['layanan konsultansi', 'jasa branding', 'pengembangan software', 'layanan teknologi', 'SAIKI services'],
    },
    en: {
      title: 'SAIKI Services | Consultancy, Imagery, Technology',
      description: 'Complete solutions from SAIKI: career consultancy, branding & marketing, and software development. Find the right solution for your needs.',
      keywords: ['consultancy services', 'branding services', 'software development', 'technology services', 'SAIKI services'],
    },
  },
  consultancy: {
    id: {
      title: 'SAIKI Consultancy | Konsultansi & Arah Karier',
      description: 'Konsultansi karier strategis: arah karier, pengembangan profesional, persiapan kerja, dan positioning yang tepat.',
      keywords: ['konsultansi karier', 'arah karier', 'pengembangan profesional', 'persiapan kerja', 'career coaching Indonesia'],
    },
    en: {
      title: 'SAIKI Consultancy | Career Direction & Consulting',
      description: 'Strategic career consultancy: career direction, professional development, job readiness, and smart positioning.',
      keywords: ['career consultancy', 'career direction', 'professional development', 'job readiness', 'career coaching'],
    },
  },
  imagery: {
    id: {
      title: 'SAIKI Imagery | Branding & Pemasaran',
      description: 'Branding dan pemasaran yang membangun koneksi: identitas brand, strategi komunikasi, kampanye, dan konten.',
      keywords: ['branding', 'pemasaran digital', 'identitas brand', 'strategi komunikasi', 'desain grafis', 'konten marketing'],
    },
    en: {
      title: 'SAIKI Imagery | Branding & Marketing',
      description: 'Branding and marketing that builds connections: brand identity, communication strategy, campaigns, and content.',
      keywords: ['branding', 'digital marketing', 'brand identity', 'communication strategy', 'graphic design', 'content marketing'],
    },
  },
  technology: {
    id: {
      title: 'SAIKI Technology | Pengembangan Software',
      description: 'Solusi software untuk kebutuhan nyata: custom development, white-label, sistem bisnis internal, dan customization.',
      keywords: ['pengembangan software', 'custom development', 'white-label', 'sistem bisnis', 'aplikasi web', 'teknologi Indonesia'],
    },
    en: {
      title: 'SAIKI Technology | Software Development',
      description: 'Software solutions for real needs: custom development, white-label, internal business systems, and customization.',
      keywords: ['software development', 'custom development', 'white-label', 'business systems', 'web applications', 'Indonesia tech'],
    },
  },
  insights: {
    id: {
      title: 'Insights SAIKI | Perspektif & Pemikiran',
      description: 'Artikel dan analisis dari tim SAIKI tentang karier, branding, teknologi, dan dinamika bisnis.',
      keywords: ['artikel bisnis', 'insight karier', 'branding tips', 'teknologi terbaru', 'blog SAIKI'],
    },
    en: {
      title: 'SAIKI Insights | Perspectives & Thoughts',
      description: 'Articles and analyses from the SAIKI team on careers, branding, technology, and business dynamics.',
      keywords: ['business articles', 'career insights', 'branding tips', 'latest technology', 'SAIKI blog'],
    },
  },
  contact: {
    id: {
      title: 'Kontak SAIKI | Hubungi Kami',
      description: 'Hubungi SAIKI Group untuk konsultansi karier, branding, pengembangan software, atau kolaborasi.',
      keywords: ['kontak SAIKI', 'hubungi kami', 'konsultasi gratis', 'kolaborasi bisnis'],
    },
    en: {
      title: 'Contact SAIKI | Get in Touch',
      description: 'Contact SAIKI Group for career consultancy, branding, software development, or collaboration.',
      keywords: ['contact SAIKI', 'get in touch', 'free consultation', 'business collaboration'],
    },
  },
};

export function getPageSeo(page: string, locale: Locale): PageSeo {
  return seoData[page]?.[locale] ?? seoData.home[locale];
}
