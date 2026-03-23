import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'digital-content-system-ecommerce',
  category: 'imagery',
  title: 'Sistem Konten Digital untuk E-Commerce Fashion',
  subtitle: 'Scalable content production untuk ratusan produk baru setiap bulan.',
  industry: 'E-Commerce & Fashion',
  year: '2024',
  duration: '3 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'logistics-backbone-system', title: 'Logistics Operation Backbone System' },
};

const en: ProjectDetail = {
  slug: 'digital-content-system-ecommerce',
  category: 'imagery',
  title: 'Digital Content System for Fashion E-Commerce',
  subtitle: 'Scalable content production for hundreds of new products every month.',
  industry: 'E-Commerce & Fashion',
  year: '2024',
  duration: '3 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'logistics-backbone-system', title: 'Logistics Operation Backbone System' },
};

registerProject('digital-content-system-ecommerce', { id: () => id, en: () => en });
