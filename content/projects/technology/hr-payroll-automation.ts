import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'hr-payroll-automation',
  category: 'technology',
  title: 'HR & Payroll Automation Platform',
  subtitle: 'Otomasi HR dan payroll untuk skema kompensasi yang kompleks.',
  industry: 'Professional Services',
  year: '2023',
  duration: '5 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'customer-portal-ticketing-isp', title: 'Customer Portal & Ticketing System' },
};

const en: ProjectDetail = {
  slug: 'hr-payroll-automation',
  category: 'technology',
  title: 'HR & Payroll Automation Platform',
  subtitle: 'HR and payroll automation for complex compensation schemes.',
  industry: 'Professional Services',
  year: '2023',
  duration: '5 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'customer-portal-ticketing-isp', title: 'Customer Portal & Ticketing System' },
};

registerProject('hr-payroll-automation', { id: () => id, en: () => en });
