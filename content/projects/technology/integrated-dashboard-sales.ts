import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'integrated-dashboard-sales',
  category: 'technology',
  title: 'Integrated Dashboard & Sales Management',
  subtitle: 'Satu dashboard terpadu untuk proses penjualan, order, dan pelaporan.',
  industry: 'Multi-Industri Lokal',
  year: '2024',
  duration: '4 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'custom-erp-distributor-fmcg', title: 'Custom ERP untuk Distributor FMCG' },
};

const en: ProjectDetail = {
  slug: 'integrated-dashboard-sales',
  category: 'technology',
  title: 'Integrated Dashboard & Sales Management',
  subtitle: 'One unified dashboard for sales processes, orders, and reporting.',
  industry: 'Multi-Industry Local',
  year: '2024',
  duration: '4 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'custom-erp-distributor-fmcg', title: 'Custom ERP for FMCG Distributor' },
};

registerProject('integrated-dashboard-sales', { id: () => id, en: () => en });
