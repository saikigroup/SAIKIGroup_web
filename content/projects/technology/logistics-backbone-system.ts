import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'logistics-backbone-system',
  category: 'technology',
  title: 'Logistics Operation Backbone System',
  subtitle: 'Dari spreadsheet ke sistem terintegrasi untuk ribuan pengiriman harian.',
  industry: 'Logistics & Ekspedisi',
  year: '2024',
  duration: '6 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'integrated-dashboard-sales', title: 'Integrated Dashboard & Sales Management' },
};

const en: ProjectDetail = {
  slug: 'logistics-backbone-system',
  category: 'technology',
  title: 'Logistics Operation Backbone System',
  subtitle: 'From spreadsheets to an integrated system for thousands of daily deliveries.',
  industry: 'Logistics & Shipping',
  year: '2024',
  duration: '6 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'integrated-dashboard-sales', title: 'Integrated Dashboard & Sales Management' },
};

registerProject('logistics-backbone-system', { id: () => id, en: () => en });
