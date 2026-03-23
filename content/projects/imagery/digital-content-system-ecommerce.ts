import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'digital-content-system-ecommerce',
  category: 'imagery',
  title: 'Sistem Konten Digital untuk E-Commerce Fashion',
  subtitle: 'Scalable content production untuk ratusan produk baru setiap bulan.',
  industry: 'E-Commerce & Fashion',
  year: '2024',
  duration: '3 bulan',
  overview: 'Platform e-commerce fashion ini menghadapi bottleneck yang tidak terduga: bukan di teknologi atau logistik, tapi di produksi konten visual. Setiap bulan, ratusan produk baru harus difoto, di-edit, diberi deskripsi, dan dipublikasikan di berbagai channel. Tim konten mereka kewalahan, kualitas tidak konsisten, dan time-to-market untuk produk baru terlalu lama. Kami diminta untuk merancang sistem produksi konten yang scalable tanpa mengorbankan kualitas visual.',
  sections: [
    {
      type: 'highlight',
      heading: 'Akar Masalahnya Bukan Kurang Orang',
      body: 'Saat pertama kali berdiskusi, klien mengira solusinya adalah menambah tim konten. Tapi setelah kami melakukan audit proses, masalah sebenarnya jauh lebih mendasar: tidak ada sistem. Setiap fotografer punya style sendiri, tidak ada template editing yang standar, briefing untuk setiap produk harus ditulis manual dari nol, dan approval process melibatkan terlalu banyak orang tanpa kriteria yang jelas. Hasilnya, menambah orang justru akan menambah chaos.',
    },
    {
      type: 'two-column',
      left: {
        heading: 'Sebelum: Proses yang Fragmented',
        body: 'Rata-rata dibutuhkan 5 hari kerja dari foto produk hingga konten siap publish. Setiap produk melewati 7 handoff yang berbeda, masing-masing dengan standar dan ekspektasi sendiri. Revision rate mencapai 40% karena misalignment antara apa yang diminta dan apa yang dieksekusi. Tim merasa frustrasi, dan produk baru sering tertunda launch-nya.',
      },
      right: {
        heading: 'Sesudah: Mesin Konten yang Terstruktur',
        body: 'Dengan sistem baru, proses dari foto hingga publish turun menjadi 1.5 hari kerja. Handoff dikurangi dari 7 menjadi 3 checkpoint utama. Revision rate turun ke 12% karena briefing dan standar visual sudah terdefinisi sejak awal. Tim bisa fokus pada kreativitas, bukan administrasi.',
      },
    },
    {
      type: 'metrics',
      heading: 'Perubahan dalam Angka',
      items: [
        { value: '70%', label: 'Pengurangan waktu produksi per produk' },
        { value: '300+', label: 'Produk bisa di-handle per bulan' },
        { value: '12%', label: 'Revision rate (turun dari 40%)' },
        { value: '3', label: 'Checkpoint vs 7 handoff sebelumnya' },
      ],
    },
    {
      type: 'process-steps',
      heading: 'Apa yang Kami Bangun',
      steps: [
        {
          number: '01',
          title: 'Visual Style Library',
          description: 'Katalog referensi visual yang terkategorisasi berdasarkan jenis produk, musim, dan channel distribusi. Fotografer dan editor bisa langsung merujuk ke referensi yang tepat tanpa briefing panjang.',
        },
        {
          number: '02',
          title: 'Template Editing Pipeline',
          description: 'Preset editing untuk Lightroom dan Photoshop yang sudah di-customize sesuai brand guideline. Termasuk batch processing workflow yang memungkinkan editing ratusan foto dengan konsistensi tinggi.',
        },
        {
          number: '03',
          title: 'Content Brief Generator',
          description: 'Template brief semi-otomatis yang mengisi konteks berdasarkan kategori produk, target channel, dan campaign yang sedang berjalan. Tim marketing tinggal menambahkan detail spesifik.',
        },
        {
          number: '04',
          title: 'Quality Gate System',
          description: 'Tiga checkpoint dengan kriteria objektif yang menggantikan proses approval subjektif. Checklist visual memastikan setiap konten memenuhi standar sebelum lanjut ke tahap berikutnya.',
        },
        {
          number: '05',
          title: 'Channel Adaptation Kit',
          description: 'System otomatis untuk meng-export satu foto produk ke berbagai format dan ratio yang dibutuhkan oleh marketplace, website, Instagram, dan WhatsApp catalog.',
        },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'Kreativitas yang sesungguhnya bukan tentang kebebasan tanpa batas. Kreativitas berkembang justru ketika ada sistem yang membebaskan orang dari pekerjaan repetitif.',
    },
    {
      type: 'text',
      heading: 'Yang Membuat Sistem Ini Bertahan',
      body: 'Banyak perusahaan yang pernah mencoba membangun "sistem konten" tapi gagal karena terlalu rigid atau terlalu bergantung pada tool tertentu. Pendekatan kami berbeda: sistem ini dirancang untuk bisa berevolusi.\n\nSetiap komponen bersifat modular dan bisa di-update secara independen. Style library bisa ditambah referensi baru setiap musim. Template editing bisa di-adjust saat brand guideline berubah. Dan yang terpenting, kami melatih tim internal untuk bisa me-maintain dan mengembangkan sistem ini sendiri, sehingga tidak bergantung pada pihak eksternal selamanya.',
    },
  ],
  outcome: {
    heading: 'Dari Bottleneck Menjadi Competitive Advantage',
    body: 'Yang dulunya menjadi titik lemah terbesar perusahaan ini sekarang menjadi salah satu keunggulan kompetitif mereka. Mereka bisa me-launch produk baru lebih cepat dari kompetitor, dengan kualitas visual yang lebih konsisten. Tim konten yang dulunya kewalahan sekarang punya bandwidth untuk bereksperimen dengan format-format baru seperti video pendek dan content interaktif. Dan karena sistemnya scalable, mereka siap untuk pertumbuhan berikutnya tanpa perlu merombak proses lagi.',
  },
  nextProject: { slug: 'logistics-backbone-system', title: 'Logistics Operation Backbone System' },
};

const en: ProjectDetail = {
  slug: 'digital-content-system-ecommerce',
  category: 'imagery',
  title: 'Digital Content System for Fashion E-Commerce',
  subtitle: 'Scalable content production for hundreds of new products every month.',
  industry: 'E-Commerce & Fashion',
  year: '2024',
  duration: '3 months',
  overview: 'This fashion e-commerce platform hit an unexpected bottleneck: not in technology or logistics, but in visual content production. Every month, hundreds of new products needed to be photographed, edited, described, and published across multiple channels. Their content team was overwhelmed, quality was inconsistent, and time-to-market for new products was too long. We were asked to design a scalable content production system without sacrificing visual quality.',
  sections: [
    {
      type: 'highlight',
      heading: 'The Root Problem Was Not Headcount',
      body: 'During our initial discussion, the client assumed the solution was hiring more content staff. But after we audited their process, the real problem was far more fundamental: there was no system. Every photographer had their own style, there were no standard editing templates, product briefs had to be written manually from scratch, and the approval process involved too many people without clear criteria. Adding more people would only add more chaos.',
    },
    {
      type: 'two-column',
      left: {
        heading: 'Before: A Fragmented Process',
        body: 'On average, it took 5 working days from product photography to publish-ready content. Each product went through 7 different handoffs, each with their own standards and expectations. The revision rate reached 40% due to misalignment between what was requested and what was executed. The team was frustrated, and new product launches were often delayed.',
      },
      right: {
        heading: 'After: A Structured Content Engine',
        body: 'With the new system, the process from photography to publish dropped to 1.5 working days. Handoffs were reduced from 7 to 3 main checkpoints. The revision rate fell to 12% because briefing and visual standards were defined from the start. The team could focus on creativity, not administration.',
      },
    },
    {
      type: 'metrics',
      heading: 'The Change in Numbers',
      items: [
        { value: '70%', label: 'Reduction in production time per product' },
        { value: '300+', label: 'Products handled per month' },
        { value: '12%', label: 'Revision rate (down from 40%)' },
        { value: '3', label: 'Checkpoints vs 7 handoffs before' },
      ],
    },
    {
      type: 'process-steps',
      heading: 'What We Built',
      steps: [
        {
          number: '01',
          title: 'Visual Style Library',
          description: 'A categorized visual reference catalog organized by product type, season, and distribution channel. Photographers and editors can reference the right style without lengthy briefings.',
        },
        {
          number: '02',
          title: 'Template Editing Pipeline',
          description: 'Editing presets for Lightroom and Photoshop customized to brand guidelines. Includes a batch processing workflow enabling high-consistency editing of hundreds of photos.',
        },
        {
          number: '03',
          title: 'Content Brief Generator',
          description: 'A semi-automated brief template that fills context based on product category, target channel, and active campaigns. The marketing team only needs to add specific details.',
        },
        {
          number: '04',
          title: 'Quality Gate System',
          description: 'Three checkpoints with objective criteria replacing the subjective approval process. A visual checklist ensures every piece of content meets standards before moving forward.',
        },
        {
          number: '05',
          title: 'Channel Adaptation Kit',
          description: 'An automated system to export a single product photo into multiple formats and ratios required by marketplaces, websites, Instagram, and WhatsApp catalogs.',
        },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'True creativity is not about limitless freedom. Creativity thrives when there is a system that frees people from repetitive work.',
    },
    {
      type: 'text',
      heading: 'What Makes This System Last',
      body: 'Many companies have tried building a "content system" but failed because it was too rigid or too dependent on specific tools. Our approach was different: this system was designed to evolve.\n\nEvery component is modular and can be updated independently. The style library can be expanded with new references each season. Editing templates can be adjusted when brand guidelines change. And most importantly, we trained the internal team to maintain and develop this system on their own, so they are not dependent on external parties forever.',
    },
  ],
  outcome: {
    heading: 'From Bottleneck to Competitive Advantage',
    body: 'What used to be this company\'s biggest weakness is now one of their competitive advantages. They can launch new products faster than competitors, with more consistent visual quality. The content team that was once overwhelmed now has the bandwidth to experiment with new formats like short videos and interactive content. And because the system is scalable, they are ready for their next growth phase without needing to overhaul the process again.',
  },
  nextProject: { slug: 'logistics-backbone-system', title: 'Logistics Operation Backbone System' },
};

registerProject('digital-content-system-ecommerce', { id: () => id, en: () => en });
