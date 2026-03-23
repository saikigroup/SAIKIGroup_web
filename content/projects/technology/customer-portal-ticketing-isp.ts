import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'customer-portal-ticketing-isp',
  category: 'technology',
  title: 'Customer Portal & Ticketing System',
  subtitle: 'Mengubah cara ISP regional melayani pelanggan mereka.',
  industry: 'Telekomunikasi & ISP',
  year: '2024',
  duration: '4 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'data-analytics-platform-agritech', title: 'Data Analytics Platform untuk Agritech' },
};

const en: ProjectDetail = {
  slug: 'customer-portal-ticketing-isp',
  category: 'technology',
  title: 'Customer Portal & Ticketing System',
  subtitle: 'Changing how a regional ISP serves their customers.',
  industry: 'Telecommunications & ISP',
  year: '2024',
  duration: '4 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'data-analytics-platform-agritech', title: 'Data Analytics Platform for Agritech' },
};

registerProject('customer-portal-ticketing-isp', { id: () => id, en: () => en });
