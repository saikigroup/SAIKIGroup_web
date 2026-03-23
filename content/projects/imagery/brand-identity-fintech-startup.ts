import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'brand-identity-fintech-startup',
  category: 'imagery',
  title: 'Membangun Identitas Visual untuk Startup Fintech',
  subtitle: 'Ketika kepercayaan dan inovasi harus berjalan beriringan dalam satu identitas brand.',
  industry: 'Financial Technology',
  year: '2024',
  duration: '3 bulan',
  overview: 'Sebuah startup fintech yang sedang dalam fase growth menghadapi tantangan klasik: produk mereka sudah kuat secara teknologi, tapi identitas visual mereka belum bisa menyampaikan level kepercayaan yang dibutuhkan oleh target pasar mereka. Di industri keuangan, persepsi visual bukan sekadar estetika. Ini soal kredibilitas. Kami diminta untuk membangun sistem identitas brand dari nol yang bisa menjembatani dua narasi sekaligus: inovasi teknologi dan keandalan finansial.',
  sections: [
    {
      type: 'challenge-solution',
      challengeHeading: 'Tantangan yang Dihadapi',
      solutionHeading: 'Pendekatan SAIKI',
      challenges: [
        {
          title: 'Identitas visual yang tidak konsisten',
          description: 'Logo, warna, dan tipografi berubah-ubah di setiap touchpoint. Pitch deck berbeda dengan website, yang berbeda lagi dengan materi marketing. Ini menciptakan kesan perusahaan yang belum mature.',
        },
        {
          title: 'Persepsi trust yang rendah',
          description: 'Calon pengguna dan investor menilai produk fintech berdasarkan tampilan pertama. Visual yang terkesan "startup banget" membuat mereka ragu untuk mempercayakan uang mereka.',
        },
        {
          title: 'Diferensiasi di pasar yang ramai',
          description: 'Puluhan fintech baru bermunculan setiap tahun dengan positioning serupa. Tanpa identitas visual yang kuat, sulit untuk menonjol dan diingat.',
        },
      ],
      solutions: [
        {
          title: 'Audit visual menyeluruh',
          description: 'Kami mulai dengan memetakan semua touchpoint yang ada, mengidentifikasi inkonsistensi, dan memahami bagaimana stakeholder internal maupun eksternal mempersepsikan brand saat ini.',
        },
        {
          title: 'Brand strategy workshop',
          description: 'Bersama tim founder, kami mendefinisikan brand personality, value proposition visual, dan tone of voice yang ingin disampaikan. Ini menjadi fondasi sebelum menyentuh desain.',
        },
        {
          title: 'Sistem identitas modular',
          description: 'Kami merancang sistem visual yang modular dan scalable, bukan sekadar logo baru. Termasuk color system, typography scale, icon set, dan guidelines penggunaan di berbagai media.',
        },
      ],
    },
    {
      type: 'process-steps',
      heading: 'Proses Pengerjaan',
      steps: [
        {
          number: '01',
          title: 'Discovery & Research',
          description: 'Dua minggu pertama dihabiskan untuk memahami industri fintech, kompetitor, dan target audiens. Kami melakukan desk research, stakeholder interview, dan competitive visual audit.',
        },
        {
          number: '02',
          title: 'Strategy & Direction',
          description: 'Dari insight yang terkumpul, kami merumuskan tiga arah kreatif yang berbeda. Masing-masing mewakili positioning yang berbeda: trust-first, tech-forward, dan balanced approach.',
        },
        {
          number: '03',
          title: 'Design & Iteration',
          description: 'Setelah direction disetujui, kami mengembangkan sistem identitas lengkap. Proses iterasi melibatkan feedback loop dengan tim internal dan testing visual dengan sample audiens.',
        },
        {
          number: '04',
          title: 'Delivery & Guidelines',
          description: 'Deliverable akhir bukan hanya file desain, tapi brand book komprehensif yang memungkinkan tim internal menerapkan identitas baru secara konsisten tanpa supervisi desainer.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Brand bukan soal tampil cantik. Brand adalah janji visual yang membuat orang merasa aman untuk mengambil keputusan.',
      attribution: 'Prinsip yang kami pegang sepanjang project ini',
    },
    {
      type: 'metrics',
      heading: 'Dampak yang Terukur',
      items: [
        { value: '3x', label: 'Peningkatan brand recall dalam survei post-launch' },
        { value: '47%', label: 'Peningkatan conversion rate landing page' },
        { value: '100%', label: 'Konsistensi visual di semua touchpoint' },
        { value: '1', label: 'Brand book lengkap sebagai panduan tim' },
      ],
    },
    {
      type: 'text',
      heading: 'Pelajaran dari Project Ini',
      body: 'Project ini mengingatkan kami bahwa di industri yang berhubungan dengan kepercayaan finansial, setiap pixel punya bobot. Warna yang terlalu playful bisa menurunkan persepsi keamanan. Tipografi yang terlalu formal bisa membuat brand terasa tidak approachable.\n\nKeseimbangan ini tidak bisa ditemukan hanya lewat intuisi desain. Dibutuhkan riset, testing, dan keberanian untuk iterasi sampai menemukan titik yang tepat. Dan hasilnya berbicara: identitas baru ini bukan hanya lebih bagus secara visual, tapi secara langsung berkontribusi pada metrik bisnis yang penting.',
    },
  ],
  outcome: {
    heading: 'Identitas yang Bekerja untuk Bisnis',
    body: 'Startup ini sekarang memiliki sistem identitas visual yang konsisten di seluruh touchpoint, dari aplikasi mobile hingga pitch deck investor. Yang lebih penting, identitas baru ini berhasil menyampaikan narasi yang mereka butuhkan: bahwa mereka adalah perusahaan teknologi yang bisa dipercaya dengan uang Anda. Brand recall meningkat signifikan, dan tim internal bisa bekerja lebih cepat karena tidak perlu lagi "menebak" bagaimana brand mereka seharusnya terlihat.',
  },
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
  overview: 'A growth-stage fintech startup faced a classic challenge: their product was technically strong, but their visual identity could not convey the level of trust their target market demands. In the financial industry, visual perception is not just about aesthetics. It is about credibility. We were tasked with building a brand identity system from scratch that could bridge two narratives at once: technological innovation and financial reliability.',
  sections: [
    {
      type: 'challenge-solution',
      challengeHeading: 'The Challenges',
      solutionHeading: 'SAIKI\'s Approach',
      challenges: [
        {
          title: 'Inconsistent visual identity',
          description: 'Logo, colors, and typography varied across every touchpoint. The pitch deck looked different from the website, which looked different from marketing materials. This created the impression of an immature company.',
        },
        {
          title: 'Low trust perception',
          description: 'Potential users and investors judge fintech products by their first impression. Visuals that looked too "startup-ish" made them hesitate to trust the platform with their money.',
        },
        {
          title: 'Differentiation in a crowded market',
          description: 'Dozens of new fintechs emerge every year with similar positioning. Without a strong visual identity, it is difficult to stand out and be remembered.',
        },
      ],
      solutions: [
        {
          title: 'Comprehensive visual audit',
          description: 'We started by mapping every existing touchpoint, identifying inconsistencies, and understanding how both internal and external stakeholders perceived the current brand.',
        },
        {
          title: 'Brand strategy workshop',
          description: 'Together with the founding team, we defined brand personality, visual value proposition, and the tone of voice to convey. This became the foundation before touching any design.',
        },
        {
          title: 'Modular identity system',
          description: 'We designed a modular and scalable visual system, not just a new logo. This included a color system, typography scale, icon set, and usage guidelines across various media.',
        },
      ],
    },
    {
      type: 'process-steps',
      heading: 'Our Process',
      steps: [
        {
          number: '01',
          title: 'Discovery & Research',
          description: 'The first two weeks were spent understanding the fintech industry, competitors, and target audience. We conducted desk research, stakeholder interviews, and a competitive visual audit.',
        },
        {
          number: '02',
          title: 'Strategy & Direction',
          description: 'From the collected insights, we formulated three distinct creative directions. Each represented a different positioning: trust-first, tech-forward, and a balanced approach.',
        },
        {
          number: '03',
          title: 'Design & Iteration',
          description: 'After the direction was approved, we developed the complete identity system. The iteration process involved feedback loops with the internal team and visual testing with sample audiences.',
        },
        {
          number: '04',
          title: 'Delivery & Guidelines',
          description: 'The final deliverable was not just design files, but a comprehensive brand book that enables the internal team to apply the new identity consistently without designer supervision.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'A brand is not about looking pretty. A brand is a visual promise that makes people feel safe enough to make a decision.',
      attribution: 'The principle we held throughout this project',
    },
    {
      type: 'metrics',
      heading: 'Measurable Impact',
      items: [
        { value: '3x', label: 'Increase in brand recall from post-launch survey' },
        { value: '47%', label: 'Landing page conversion rate improvement' },
        { value: '100%', label: 'Visual consistency across all touchpoints' },
        { value: '1', label: 'Complete brand book as team guide' },
      ],
    },
    {
      type: 'text',
      heading: 'Lessons from This Project',
      body: 'This project reminded us that in industries dealing with financial trust, every pixel carries weight. Colors that are too playful can lower the perception of security. Typography that is too formal can make the brand feel unapproachable.\n\nThis balance cannot be found through design intuition alone. It requires research, testing, and the courage to iterate until finding the right point. And the results speak for themselves: the new identity is not just visually better, but directly contributes to important business metrics.',
    },
  ],
  outcome: {
    heading: 'An Identity That Works for the Business',
    body: 'This startup now has a consistent visual identity system across all touchpoints, from their mobile app to investor pitch decks. More importantly, the new identity successfully conveys the narrative they needed: that they are a technology company you can trust with your money. Brand recall increased significantly, and the internal team can work faster because they no longer need to "guess" what their brand should look like.',
  },
  nextProject: { slug: 'visual-campaign-fnb-chain', title: 'Visual Campaign for a National F&B Chain' },
};

registerProject('brand-identity-fintech-startup', { id: () => id, en: () => en });
