import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'corporate-rebranding-manufaktur',
  category: 'imagery',
  title: 'Rebranding Korporat Perusahaan Manufaktur',
  subtitle: 'Modernisasi visual tanpa kehilangan 20 tahun warisan brand.',
  industry: 'Manufacturing',
  year: '2023',
  duration: '5 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'digital-content-system-ecommerce', title: 'Sistem Konten Digital untuk E-Commerce Fashion' },
};

const en: ProjectDetail = {
  slug: 'corporate-rebranding-manufaktur',
  category: 'imagery',
  title: 'Corporate Rebranding for a Manufacturing Company',
  subtitle: 'Visual modernization without losing 20 years of brand heritage.',
  industry: 'Manufacturing',
  year: '2023',
  duration: '5 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'digital-content-system-ecommerce', title: 'Digital Content System for Fashion E-Commerce' },
};

registerProject('corporate-rebranding-manufaktur', { id: () => id, en: () => en });
