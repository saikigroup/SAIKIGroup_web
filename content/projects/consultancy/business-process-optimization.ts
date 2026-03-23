import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'business-process-optimization',
  category: 'consultancy',
  title: 'Business Process Optimization Lintas Industri',
  subtitle: 'Pendekatan konsultatif SAIKI dalam mengoptimalkan proses bisnis di berbagai sektor.',
  industry: 'Multi-Industri',
  year: '2023-2024',
  duration: 'Berkelanjutan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'brand-identity-fintech-startup', title: 'Membangun Identitas Visual untuk Startup Fintech' },
};

const en: ProjectDetail = {
  slug: 'business-process-optimization',
  category: 'consultancy',
  title: 'Cross-Industry Business Process Optimization',
  subtitle: 'SAIKI\'s consultative approach to optimizing business processes across sectors.',
  industry: 'Multi-Industry',
  year: '2023-2024',
  duration: 'Ongoing',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'brand-identity-fintech-startup', title: 'Building a Visual Identity for a Fintech Startup' },
};

registerProject('business-process-optimization', { id: () => id, en: () => en });
