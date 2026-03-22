import type { Locale } from '@/lib/i18n';

type PageSeo = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

type SeoMap = Record<string, Record<Locale, PageSeo>>;

export const seoData: SeoMap = {
  home: {
    id: {
      title: 'SAIKI Group | Konsultansi, Branding & Teknologi',
      description: 'SAIKI Group adalah ekosistem terintegrasi untuk konsultansi karier, branding & pemasaran, dan pengembangan teknologi. Bergerak sekarang.',
      ogTitle: 'SAIKI Group | Bergerak Sekarang',
      ogDescription: 'Konsultansi karier, branding, dan teknologi dalam satu ekosistem.',
    },
    en: {
      title: 'SAIKI Group | Consultancy, Branding & Technology',
      description: 'SAIKI Group is an integrated ecosystem for career consultancy, branding & marketing, and technology development. Move now.',
      ogTitle: 'SAIKI Group | Move Now',
      ogDescription: 'Career consultancy, branding, and technology in one ecosystem.',
    },
  },
  about: {
    id: {
      title: 'Tentang SAIKI | Dibangun untuk Masa Kini',
      description: 'Pelajari bagaimana SAIKI Group menggabungkan konsultansi, branding, dan teknologi dalam satu ekosistem yang terintegrasi.',
    },
    en: {
      title: 'About SAIKI | Built for the Present',
      description: 'Learn how SAIKI Group combines consultancy, branding, and technology in one integrated ecosystem.',
    },
  },
  services: {
    id: {
      title: 'Layanan SAIKI | Konsultansi, Imagery, Technology',
      description: 'Tiga lini bisnis SAIKI: konsultansi karier, branding & pemasaran, dan pengembangan software. Temukan layanan yang tepat.',
    },
    en: {
      title: 'SAIKI Services | Consultancy, Imagery, Technology',
      description: 'Three SAIKI business lines: career consultancy, branding & marketing, and software development. Find the right service.',
    },
  },
  consultancy: {
    id: {
      title: 'SAIKI Consultancy | Konsultansi & Arah Karier',
      description: 'Konsultansi karier strategis: arah karier, pengembangan profesional, persiapan kerja, dan positioning yang tepat.',
    },
    en: {
      title: 'SAIKI Consultancy | Career Direction & Consulting',
      description: 'Strategic career consultancy: career direction, professional development, job readiness, and smart positioning.',
    },
  },
  imagery: {
    id: {
      title: 'SAIKI Imagery | Branding & Pemasaran',
      description: 'Branding dan pemasaran yang membangun koneksi: identitas brand, strategi komunikasi, kampanye, dan konten.',
    },
    en: {
      title: 'SAIKI Imagery | Branding & Marketing',
      description: 'Branding and marketing that builds connections: brand identity, communication strategy, campaigns, and content.',
    },
  },
  technology: {
    id: {
      title: 'SAIKI Technology | Pengembangan Software',
      description: 'Solusi software untuk kebutuhan nyata: custom development, white-label, sistem bisnis internal, dan customization.',
    },
    en: {
      title: 'SAIKI Technology | Software Development',
      description: 'Software solutions for real needs: custom development, white-label, internal business systems, and customization.',
    },
  },
  insights: {
    id: {
      title: 'Insights SAIKI | Perspektif & Pemikiran',
      description: 'Artikel dan analisis dari tim SAIKI tentang karier, branding, teknologi, dan dinamika bisnis.',
    },
    en: {
      title: 'SAIKI Insights | Perspectives & Thoughts',
      description: 'Articles and analyses from the SAIKI team on careers, branding, technology, and business dynamics.',
    },
  },
  contact: {
    id: {
      title: 'Kontak SAIKI | Hubungi Kami',
      description: 'Hubungi SAIKI Group untuk konsultansi karier, branding, pengembangan software, atau kolaborasi.',
    },
    en: {
      title: 'Contact SAIKI | Get in Touch',
      description: 'Contact SAIKI Group for career consultancy, branding, software development, or collaboration.',
    },
  },
};

export function getPageSeo(page: string, locale: Locale): PageSeo {
  return seoData[page]?.[locale] ?? seoData.home[locale];
}
