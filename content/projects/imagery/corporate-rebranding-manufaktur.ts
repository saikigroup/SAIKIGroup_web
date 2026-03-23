import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'corporate-rebranding-manufaktur',
  category: 'imagery',
  title: 'Rebranding Korporat Perusahaan Manufaktur',
  subtitle: 'Modernisasi visual tanpa kehilangan 20 tahun warisan brand.',
  industry: 'Manufacturing',
  year: '2023',
  duration: '5 bulan',
  overview: 'Perusahaan manufaktur yang sudah beroperasi selama dua dekade ini dikenal solid di industrinya. Tapi visual mereka menceritakan kisah yang berbeda: logo yang terlihat usang, materi korporat yang tidak kohesif, dan kehadiran digital yang minim. Di tengah persaingan yang semakin ketat dan kebutuhan untuk menarik talenta muda serta mitra bisnis baru, mereka memutuskan bahwa sudah saatnya untuk berbenah, tanpa meninggalkan warisan yang sudah dibangun.',
  sections: [
    {
      type: 'text',
      heading: 'Konteks yang Perlu Dipahami',
      body: 'Rebranding perusahaan manufaktur sangat berbeda dengan rebranding startup atau brand consumer. Di sini, ada ekosistem stakeholder yang kompleks: karyawan yang sudah belasan tahun mengenal brand lama, klien B2B yang mengasosiasikan logo dengan kualitas dan reliabilitas, serta supplier yang sudah terbiasa dengan dokumen dan template tertentu.\n\nPerubahan yang terlalu drastis bisa menciptakan kebingungan atau bahkan resistensi. Tapi perubahan yang terlalu subtle berisiko tidak menghasilkan dampak yang diinginkan. Kami harus menemukan sweet spot di antara keduanya.',
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Kompleksitas yang Kami Hadapi',
      solutionHeading: 'Strategi Rebranding',
      challenges: [
        {
          title: 'Warisan brand yang kuat tapi usang',
          description: 'Logo dan identitas visual sudah melekat kuat di benak stakeholder. Mengubahnya secara radikal berisiko menghilangkan equity yang sudah dibangun selama 20 tahun.',
        },
        {
          title: 'Banyak touchpoint fisik',
          description: 'Berbeda dengan perusahaan digital, manufaktur punya ratusan touchpoint fisik: signage pabrik, seragam, kendaraan operasional, packaging produk, alat tulis kantor, hingga safety equipment. Biaya dan logistik transisi sangat signifikan.',
        },
        {
          title: 'Audiens yang beragam',
          description: 'Brand harus berbicara kepada klien korporat yang konservatif, calon karyawan generasi muda, regulator industri, dan komunitas sekitar pabrik. Satu bahasa visual harus menjangkau semua.',
        },
      ],
      solutions: [
        {
          title: 'Evolutionary rebrand, bukan revolutionary',
          description: 'Kami memilih pendekatan evolusioner: mempertahankan elemen-elemen yang sudah punya equity tinggi sambil memodernisasi eksekusinya. Logo di-refine, bukan diganti total.',
        },
        {
          title: 'Phased rollout strategy',
          description: 'Transisi dilakukan bertahap, dimulai dari touchpoint digital (yang biayanya rendah) lalu bertahap ke touchpoint fisik sesuai jadwal penggantian alami masing-masing aset.',
        },
        {
          title: 'Dual-audience visual system',
          description: 'Kami merancang dua "mode" visual yang saling melengkapi: formal mode untuk komunikasi B2B dan regulatory, serta modern mode untuk employer branding dan digital presence.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Rebranding bukan tentang menjadi baru. Rebranding adalah tentang menjadi versi terbaik dari siapa Anda sebenarnya.',
      attribution: 'Filosofi yang memandu seluruh proses',
    },
    {
      type: 'process-steps',
      heading: 'Tahapan Rebranding',
      steps: [
        {
          number: '01',
          title: 'Heritage Audit',
          description: 'Kami mendokumentasikan seluruh sejarah visual perusahaan, mewawancarai karyawan senior, dan mengidentifikasi elemen mana yang punya nilai emosional dan fungsional paling tinggi.',
        },
        {
          number: '02',
          title: 'Stakeholder Alignment',
          description: 'Presentasi ke board of directors, town hall dengan karyawan, dan sesi feedback dengan klien utama. Setiap kelompok stakeholder punya concern yang berbeda yang harus diakomodasi.',
        },
        {
          number: '03',
          title: 'Design Development',
          description: 'Pengembangan identitas baru yang mempertahankan DNA visual perusahaan sambil membawa napas modern. Setiap elemen di-test dengan representative dari setiap kelompok stakeholder.',
        },
        {
          number: '04',
          title: 'Transition Planning',
          description: 'Penyusunan roadmap transisi 12 bulan yang memprioritaskan touchpoint berdasarkan visibility, biaya, dan jadwal penggantian alami.',
        },
        {
          number: '05',
          title: 'Internal Launch',
          description: 'Peluncuran internal terlebih dahulu untuk membangun ownership dan pride. Karyawan menjadi brand ambassador pertama sebelum dunia luar melihat perubahan.',
        },
      ],
    },
    {
      type: 'gallery-text',
      heading: 'Deliverable yang Dihasilkan',
      body: 'Scope project ini melampaui identitas visual standar karena kompleksitas touchpoint di industri manufaktur.',
      items: [
        {
          label: 'Refined Logo & Mark',
          description: 'Logo yang di-evolusi untuk mempertahankan recognizability sambil terlihat lebih clean dan modern. Versi responsif untuk berbagai ukuran dan media.',
        },
        {
          label: 'Corporate Stationery System',
          description: 'Template untuk semua dokumen bisnis: surat resmi, kartu nama, amplop, invoice, purchase order, dan proposal. Dirancang untuk bisa dicetak in-house.',
        },
        {
          label: 'Environmental Design Guide',
          description: 'Panduan untuk signage pabrik, reception area, ruang meeting, dan area produksi. Termasuk spesifikasi material dan vendor recommendation.',
        },
        {
          label: 'Digital Presence Kit',
          description: 'Template website, social media, email signature, dan digital presentation. Ini menjadi fase pertama rollout karena biaya implementasi yang paling rendah.',
        },
        {
          label: 'Transition Toolkit',
          description: 'Roadmap visual yang menjelaskan urutan dan timeline transisi setiap touchpoint, sehingga tim internal bisa mengelola proses tanpa supervisi konstan.',
        },
      ],
    },
  ],
  outcome: {
    heading: 'Warisan yang Terbarukan',
    body: 'Enam bulan setelah fase pertama rollout, feedback dari seluruh stakeholder sangat positif. Klien B2B mengomentari bahwa perusahaan terlihat "lebih serius dan modern". Rekrutmen talenta muda meningkat karena employer branding yang lebih menarik. Dan yang paling penting, karyawan lama merasa bahwa identitas baru ini tetap "mereka", hanya versi yang lebih baik. Transisi berjalan lancar karena pendekatan bertahap yang kami rancang, dengan minimal disrupsi terhadap operasional sehari-hari.',
  },
  nextProject: { slug: 'digital-content-system-ecommerce', title: 'Sistem Konten Digital untuk E-Commerce Fashion' },
};

const en: ProjectDetail = {
  slug: 'corporate-rebranding-manufaktur',
  category: 'imagery',
  title: 'Corporate Rebranding for a Manufacturing Company',
  subtitle: 'Visual modernization without losing 20 years of brand heritage.',
  industry: 'Manufacturing',
  year: '2023',
  duration: '5 months',
  overview: 'This manufacturing company had been operating for two decades and was well-known in its industry. But their visuals told a different story: an outdated logo, incoherent corporate materials, and minimal digital presence. Amid intensifying competition and the need to attract young talent and new business partners, they decided it was time for a refresh, without leaving behind the legacy they had built.',
  sections: [
    {
      type: 'text',
      heading: 'The Context to Understand',
      body: 'Rebranding a manufacturing company is very different from rebranding a startup or consumer brand. Here, there is a complex stakeholder ecosystem: employees who have known the old brand for over a decade, B2B clients who associate the logo with quality and reliability, and suppliers accustomed to certain documents and templates.\n\nChanges that are too drastic could create confusion or even resistance. But changes that are too subtle risk not generating the desired impact. We had to find the sweet spot between the two.',
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'The Complexity We Faced',
      solutionHeading: 'Rebranding Strategy',
      challenges: [
        {
          title: 'Strong but outdated brand heritage',
          description: 'The logo and visual identity were deeply ingrained in stakeholders\' minds. Changing them radically risked erasing equity built over 20 years.',
        },
        {
          title: 'Numerous physical touchpoints',
          description: 'Unlike digital companies, manufacturing has hundreds of physical touchpoints: factory signage, uniforms, operational vehicles, product packaging, stationery, even safety equipment. Transition costs and logistics are significant.',
        },
        {
          title: 'Diverse audiences',
          description: 'The brand had to speak to conservative corporate clients, young prospective employees, industry regulators, and the community around the factory. One visual language had to reach them all.',
        },
      ],
      solutions: [
        {
          title: 'Evolutionary rebrand, not revolutionary',
          description: 'We chose an evolutionary approach: retaining elements with high equity while modernizing their execution. The logo was refined, not replaced entirely.',
        },
        {
          title: 'Phased rollout strategy',
          description: 'The transition was done gradually, starting with digital touchpoints (lower cost) then moving to physical touchpoints according to the natural replacement schedule of each asset.',
        },
        {
          title: 'Dual-audience visual system',
          description: 'We designed two complementary visual "modes": a formal mode for B2B and regulatory communication, and a modern mode for employer branding and digital presence.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Rebranding is not about becoming new. Rebranding is about becoming the best version of who you truly are.',
      attribution: 'The philosophy guiding the entire process',
    },
    {
      type: 'process-steps',
      heading: 'Rebranding Stages',
      steps: [
        {
          number: '01',
          title: 'Heritage Audit',
          description: 'We documented the entire visual history of the company, interviewed senior employees, and identified which elements held the highest emotional and functional value.',
        },
        {
          number: '02',
          title: 'Stakeholder Alignment',
          description: 'Presentations to the board of directors, town halls with employees, and feedback sessions with key clients. Each stakeholder group had different concerns that needed to be accommodated.',
        },
        {
          number: '03',
          title: 'Design Development',
          description: 'Development of a new identity that preserved the company\'s visual DNA while bringing a modern feel. Every element was tested with representatives from each stakeholder group.',
        },
        {
          number: '04',
          title: 'Transition Planning',
          description: 'Preparation of a 12-month transition roadmap prioritizing touchpoints based on visibility, cost, and natural replacement schedules.',
        },
        {
          number: '05',
          title: 'Internal Launch',
          description: 'Internal launch first to build ownership and pride. Employees became the first brand ambassadors before the outside world saw the changes.',
        },
      ],
    },
    {
      type: 'gallery-text',
      heading: 'Deliverables Produced',
      body: 'The scope of this project exceeded standard visual identity work due to the complexity of touchpoints in the manufacturing industry.',
      items: [
        {
          label: 'Refined Logo & Mark',
          description: 'An evolved logo that maintains recognizability while appearing cleaner and more modern. Responsive versions for various sizes and media.',
        },
        {
          label: 'Corporate Stationery System',
          description: 'Templates for all business documents: official letters, business cards, envelopes, invoices, purchase orders, and proposals. Designed for in-house printing.',
        },
        {
          label: 'Environmental Design Guide',
          description: 'Guidelines for factory signage, reception areas, meeting rooms, and production areas. Including material specifications and vendor recommendations.',
        },
        {
          label: 'Digital Presence Kit',
          description: 'Templates for website, social media, email signatures, and digital presentations. This became the first rollout phase due to the lowest implementation cost.',
        },
        {
          label: 'Transition Toolkit',
          description: 'A visual roadmap explaining the order and timeline for transitioning each touchpoint, so the internal team can manage the process without constant supervision.',
        },
      ],
    },
  ],
  outcome: {
    heading: 'A Renewed Legacy',
    body: 'Six months after the first rollout phase, feedback from all stakeholders was overwhelmingly positive. B2B clients commented that the company looked "more serious and modern." Recruitment of young talent increased thanks to more attractive employer branding. And most importantly, long-time employees felt that the new identity was still "theirs," just a better version. The transition went smoothly thanks to the phased approach we designed, with minimal disruption to daily operations.',
  },
  nextProject: { slug: 'digital-content-system-ecommerce', title: 'Digital Content System for Fashion E-Commerce' },
};

registerProject('corporate-rebranding-manufaktur', { id: () => id, en: () => en });
