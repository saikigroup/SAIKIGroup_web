import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'custom-erp-distributor-fmcg',
  category: 'technology',
  title: 'Custom ERP untuk Distributor FMCG',
  subtitle: 'Mengganti sistem legacy dengan ERP custom untuk rantai distribusi kompleks.',
  industry: 'FMCG & Distribusi',
  year: '2023',
  duration: '8 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'inventory-management-retail', title: 'Inventory Management System untuk Retail Chain' },
};

const en: ProjectDetail = {
  slug: 'custom-erp-distributor-fmcg',
  category: 'technology',
  title: 'Custom ERP for FMCG Distributor',
  subtitle: 'Replacing a legacy system with a custom ERP for complex distribution chains.',
  industry: 'FMCG & Distribution',
  year: '2023',
  duration: '8 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'inventory-management-retail', title: 'Inventory Management System for Retail Chain' },
};

registerProject('custom-erp-distributor-fmcg', { id: () => id, en: () => en });
