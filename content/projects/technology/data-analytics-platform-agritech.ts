import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'data-analytics-platform-agritech',
  category: 'technology',
  title: 'Data Analytics Platform untuk Agritech',
  subtitle: 'Mengubah data sensor IoT menjadi insight yang actionable untuk petani.',
  industry: 'Agriculture Technology',
  year: '2024',
  duration: '5 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'business-process-optimization', title: 'Business Process Optimization Lintas Industri' },
};

const en: ProjectDetail = {
  slug: 'data-analytics-platform-agritech',
  category: 'technology',
  title: 'Data Analytics Platform for Agritech',
  subtitle: 'Turning IoT sensor data into actionable insights for farmers.',
  industry: 'Agriculture Technology',
  year: '2024',
  duration: '5 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'business-process-optimization', title: 'Cross-Industry Business Process Optimization' },
};

registerProject('data-analytics-platform-agritech', { id: () => id, en: () => en });
