import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'brand-identity-fintech-startup',
  category: 'imagery',
  title: 'Membangun Identitas Visual untuk Startup Fintech',
  subtitle: 'Ketika kepercayaan dan inovasi harus berjalan beriringan dalam satu identitas brand.',
  industry: 'Financial Technology',
  year: '2024',
  duration: '3 bulan',
  overview: 'Konten detail akan segera hadir.',
  sections: [],
  outcome: { heading: 'Segera hadir', body: 'Konten detail sedang disiapkan.' },
  nextProject: { slug: 'visual-campaign-fnb-chain', title: 'Kampanye Visual untuk Jaringan F&B Nasional' },
};

const en: ProjectDetail = {
  slug: 'brand-identity-fintech-startup',
  category: 'imagery',
  title: 'Building a Visual Identity for a Fintech Startup',
  subtitle: 'When trust and innovation must coexist in a single brand identity.',
  industry: 'Financial Technology',
  year: '2024',
  duration: '3 months',
  overview: 'Detailed content coming soon.',
  sections: [],
  outcome: { heading: 'Coming soon', body: 'Detailed content is being prepared.' },
  nextProject: { slug: 'visual-campaign-fnb-chain', title: 'Visual Campaign for a National F&B Chain' },
};

registerProject('brand-identity-fintech-startup', { id: () => id, en: () => en });
