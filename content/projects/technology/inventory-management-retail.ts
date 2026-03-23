import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'inventory-management-retail',
  category: 'technology',
  title: 'Inventory Management System untuk Retail Chain',
  subtitle: 'Visibilitas stok real-time dan otomasi restock di puluhan toko.',
  industry: 'Retail',
  year: '2024',
  duration: '4 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'hr-payroll-automation', title: 'HR & Payroll Automation Platform' },
};

const en: ProjectDetail = {
  slug: 'inventory-management-retail',
  category: 'technology',
  title: 'Inventory Management System for Retail Chain',
  subtitle: 'Real-time stock visibility and automated restocking across dozens of stores.',
  industry: 'Retail',
  year: '2024',
  duration: '4 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'hr-payroll-automation', title: 'HR & Payroll Automation Platform' },
};

registerProject('inventory-management-retail', { id: () => id, en: () => en });
