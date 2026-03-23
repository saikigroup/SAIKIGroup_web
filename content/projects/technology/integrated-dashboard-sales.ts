import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'integrated-dashboard-sales',
  category: 'technology',
  title: 'Integrated Dashboard & Sales Management',
  subtitle: 'Satu dashboard terpadu untuk proses penjualan, order, dan pelaporan.',
  industry: 'Multi-Industri Lokal',
  year: '2025',
  duration: '4 bulan',
  overview: 'Beberapa perusahaan skala lokal yang kami tangani memiliki masalah yang hampir identik: tim sales bekerja dengan tools yang terpisah-pisah. WhatsApp untuk komunikasi klien, spreadsheet untuk tracking pipeline, email untuk internal approval, dan aplikasi berbeda lagi untuk membuat quotation. Informasi terfragmentasi, follow-up terlewat, dan manajemen tidak punya gambaran akurat soal pipeline dan performa tim. Kami membangun satu platform terpadu yang menyatukan seluruh siklus penjualan dalam satu tempat.',
  sections: [
    {
      type: 'two-column',
      left: {
        heading: 'Pola Masalah yang Sama',
        body: 'Di tiga perusahaan berbeda yang kami tangani, polanya selalu serupa: sales terbaik punya "sistem sendiri" di kepala mereka, tapi pengetahuan ini tidak pernah ter-transfer ke tim. Ketika sales resign, pipeline-nya ikut hilang. Manager harus bertanya satu per satu ke setiap anggota tim untuk tahu status deal. Dan reporting bulanan selalu menjadi drama karena data harus dikumpulkan manual dari berbagai sumber.',
      },
      right: {
        heading: 'Yang Sebenarnya Dibutuhkan',
        body: 'Bukan CRM enterprise yang kompleks dan mahal. Perusahaan skala lokal butuh sesuatu yang simple tapi powerful: mudah digunakan oleh sales yang terbiasa dengan WhatsApp, cukup terstruktur untuk memberikan visibilitas ke manajemen, dan cukup fleksibel untuk mengakomodasi proses bisnis yang berbeda-beda di setiap perusahaan.',
      },
    },
    {
      type: 'gallery-text',
      heading: 'Modul yang Kami Bangun',
      body: 'Platform ini terdiri dari modul-modul yang saling terhubung tapi bisa diaktifkan sesuai kebutuhan masing-masing perusahaan.',
      items: [
        {
          label: 'Sales Pipeline Tracker',
          description: 'Kanban board visual untuk tracking setiap deal dari lead masuk hingga closing. Drag-and-drop yang familiar, dengan reminder otomatis untuk follow-up yang tertunda.',
        },
        {
          label: 'Quotation Builder',
          description: 'Template quotation yang bisa di-customize per perusahaan. Sales tinggal pilih produk/jasa, isi quantity, dan quotation profesional ter-generate otomatis lengkap dengan branding perusahaan.',
        },
        {
          label: 'Order Management',
          description: 'Begitu deal closing, data otomatis masuk ke modul order tanpa perlu input ulang. Tracking status order dari processing hingga delivery dalam satu alur yang jelas.',
        },
        {
          label: 'Performance Dashboard',
          description: 'Real-time dashboard untuk manajemen: total pipeline value, conversion rate per stage, performa per sales person, dan proyeksi revenue berdasarkan data aktual.',
        },
        {
          label: 'Activity Log & Notifications',
          description: 'Setiap interaksi dengan klien tercatat otomatis. Notifikasi cerdas mengingatkan sales untuk follow-up, dan memastikan tidak ada lead yang terlupakan.',
        },
      ],
    },
    {
      type: 'highlight',
      heading: 'Kunci Adopsi: Desain untuk Kebiasaan yang Sudah Ada',
      body: 'Tantangan terbesar bukan membangun sistemnya, tapi memastikan tim sales mau menggunakannya. Kami belajar dari kegagalan implementasi CRM di banyak perusahaan: tool yang terlalu berbeda dari kebiasaan kerja sehari-hari pasti ditolak. Jadi kami merancang interface yang terasa familiar. Input data dibuat semudah mengetik chat. Pipeline view mirip dengan board yang sudah mereka kenal. Dan yang paling penting: kami memastikan bahwa menggunakan sistem ini menghemat waktu mereka, bukan menambah pekerjaan.',
    },
    {
      type: 'full-width-statement',
      statement: 'Software yang tidak digunakan adalah software yang gagal, secanggih apa pun teknologinya.',
    },
    {
      type: 'metrics',
      heading: 'Rata-rata Dampak di 3 Perusahaan',
      items: [
        { value: '40%', label: 'Peningkatan conversion rate' },
        { value: '60%', label: 'Pengurangan waktu pembuatan quotation' },
        { value: '0', label: 'Lead yang terlewat follow-up' },
        { value: '95%', label: 'Tingkat adopsi oleh tim sales' },
      ],
    },
    {
      type: 'text',
      heading: 'Satu Platform, Tiga Implementasi Berbeda',
      body: 'Meskipun core platform-nya sama, setiap perusahaan mendapatkan konfigurasi yang berbeda sesuai proses bisnis mereka. Perusahaan distribusi butuh integrasi dengan inventory. Perusahaan jasa butuh milestone tracking per project. Perusahaan retail butuh koneksi dengan POS system.\n\nFleksibilitas ini bukan afterthought. Dari awal, arsitektur platform dirancang modular agar bisa diadaptasi tanpa custom development yang berat untuk setiap klien. Pendekatan ini memungkinkan kami deliver value dengan cepat sambil tetap mengakomodasi keunikan setiap bisnis.',
    },
  ],
  outcome: {
    heading: 'Dari Chaos ke Clarity',
    body: 'Di ketiga perusahaan, hasilnya konsisten: manajemen akhirnya punya visibilitas penuh terhadap pipeline dan performa tim sales tanpa harus menunggu laporan manual. Tim sales justru lebih produktif karena mereka menghabiskan lebih sedikit waktu untuk administrasi. Dan ketika ada pergantian personel, knowledge transfer menjadi jauh lebih smooth karena semua data dan history interaksi tersimpan di sistem. Salah satu klien bahkan berkomentar bahwa platform ini "mengubah cara mereka memahami bisnis mereka sendiri."',
  },
  nextProject: { slug: 'custom-erp-distributor-fmcg', title: 'Custom ERP untuk Distributor FMCG' },
};

const en: ProjectDetail = {
  slug: 'integrated-dashboard-sales',
  category: 'technology',
  title: 'Integrated Dashboard & Sales Management',
  subtitle: 'One unified dashboard for sales processes, orders, and reporting.',
  industry: 'Multi-Industry Local',
  year: '2025',
  duration: '4 months',
  overview: 'Several local-scale companies we served had nearly identical problems: their sales teams worked with fragmented tools. WhatsApp for client communication, spreadsheets for pipeline tracking, email for internal approvals, and yet another app for creating quotations. Information was fragmented, follow-ups were missed, and management had no accurate picture of their pipeline or team performance. We built a unified platform that brings the entire sales cycle into one place.',
  sections: [
    {
      type: 'two-column',
      left: {
        heading: 'The Same Problem Pattern',
        body: 'Across three different companies we served, the pattern was always similar: the best salespeople had their own "system" in their heads, but this knowledge never transferred to the team. When a salesperson resigned, their pipeline disappeared with them. Managers had to ask each team member individually for deal status updates. And monthly reporting was always a drama because data had to be manually compiled from various sources.',
      },
      right: {
        heading: 'What Was Actually Needed',
        body: 'Not a complex and expensive enterprise CRM. Local-scale companies need something simple yet powerful: easy to use for salespeople accustomed to WhatsApp, structured enough to give management visibility, and flexible enough to accommodate different business processes at each company.',
      },
    },
    {
      type: 'gallery-text',
      heading: 'Modules We Built',
      body: 'The platform consists of interconnected modules that can be activated according to each company\'s needs.',
      items: [
        {
          label: 'Sales Pipeline Tracker',
          description: 'A visual kanban board for tracking every deal from incoming lead to closing. Familiar drag-and-drop with automatic reminders for overdue follow-ups.',
        },
        {
          label: 'Quotation Builder',
          description: 'Quotation templates customizable per company. Sales just select products/services, fill in quantities, and a professional quotation auto-generates with company branding.',
        },
        {
          label: 'Order Management',
          description: 'Once a deal closes, data automatically flows into the order module without re-entry. Order status tracking from processing to delivery in one clear flow.',
        },
        {
          label: 'Performance Dashboard',
          description: 'Real-time management dashboard: total pipeline value, conversion rate per stage, performance per salesperson, and revenue projections based on actual data.',
        },
        {
          label: 'Activity Log & Notifications',
          description: 'Every client interaction is automatically recorded. Smart notifications remind sales to follow up, ensuring no lead is forgotten.',
        },
      ],
    },
    {
      type: 'highlight',
      heading: 'The Key to Adoption: Designing for Existing Habits',
      body: 'The biggest challenge was not building the system, but ensuring the sales team would actually use it. We learned from failed CRM implementations at many companies: tools that differ too much from daily work habits will always be rejected. So we designed an interface that feels familiar. Data input is as easy as typing a chat message. The pipeline view resembles boards they already know. And most importantly: we ensured that using this system saves their time, not adds to their workload.',
    },
    {
      type: 'full-width-statement',
      statement: 'Software that is not used is software that has failed, no matter how sophisticated the technology.',
    },
    {
      type: 'metrics',
      heading: 'Average Impact Across 3 Companies',
      items: [
        { value: '40%', label: 'Increase in conversion rate' },
        { value: '60%', label: 'Reduction in quotation creation time' },
        { value: '0', label: 'Leads missed for follow-up' },
        { value: '95%', label: 'Adoption rate by sales teams' },
      ],
    },
    {
      type: 'text',
      heading: 'One Platform, Three Different Implementations',
      body: 'Although the core platform is the same, each company received a different configuration matching their business processes. The distribution company needed inventory integration. The services company needed milestone tracking per project. The retail company needed POS system connection.\n\nThis flexibility was not an afterthought. From the start, the platform architecture was designed to be modular so it could be adapted without heavy custom development for each client. This approach allowed us to deliver value quickly while still accommodating each business\'s uniqueness.',
    },
  ],
  outcome: {
    heading: 'From Chaos to Clarity',
    body: 'Across all three companies, the results were consistent: management finally has full visibility into the pipeline and sales team performance without waiting for manual reports. Sales teams are actually more productive because they spend less time on administration. And when there is personnel turnover, knowledge transfer is far smoother because all data and interaction history lives in the system. One client even commented that this platform "changed how they understand their own business."',
  },
  nextProject: { slug: 'custom-erp-distributor-fmcg', title: 'Custom ERP for FMCG Distributor' },
};

registerProject('integrated-dashboard-sales', { id: () => id, en: () => en });
