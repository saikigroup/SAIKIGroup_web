import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'visual-campaign-fnb-chain',
  category: 'imagery',
  title: 'Kampanye Visual untuk Jaringan F&B Nasional',
  subtitle: 'Konsistensi brand di 50+ kota tanpa kehilangan nuansa lokal.',
  industry: 'Food & Beverage',
  year: '2024',
  duration: '4 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'corporate-rebranding-manufaktur', title: 'Rebranding Korporat Perusahaan Manufaktur' },
};

const en: ProjectDetail = {
  slug: 'visual-campaign-fnb-chain',
  category: 'imagery',
  title: 'Visual Campaign for a National F&B Chain',
  subtitle: 'Brand consistency across 50+ cities without losing local nuance.',
  industry: 'Food & Beverage',
  year: '2024',
  duration: '4 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'corporate-rebranding-manufaktur', title: 'Corporate Rebranding for a Manufacturing Company' },
};

registerProject('visual-campaign-fnb-chain', { id: () => id, en: () => en });
