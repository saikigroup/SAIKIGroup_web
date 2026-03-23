import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'custom-erp-distributor-fmcg',
  category: 'technology',
  title: 'Custom ERP untuk Distributor FMCG',
  subtitle: 'Mengganti sistem legacy dengan ERP custom untuk rantai distribusi kompleks.',
  industry: 'FMCG & Distribusi',
  year: '2024',
  duration: '8 bulan',
  overview: 'Distributor FMCG besar ini mengelola ratusan SKU dari belasan principal, didistribusikan ke ribuan outlet melalui jaringan multi-gudang di beberapa provinsi. Sistem ERP legacy yang mereka gunakan sudah berusia lebih dari satu dekade: lambat, sulit di-customize, dan biaya maintenance-nya terus meningkat setiap tahun. Tapi mengganti ERP bukan keputusan ringan. Ini adalah tulang punggung operasional yang jika salah langkah bisa melumpuhkan bisnis. Kami diminta untuk membangun ERP custom yang sesuai dengan cara kerja mereka, bukan sebaliknya.',
  sections: [
    {
      type: 'text',
      heading: 'Kenapa Custom, Bukan Off-the-Shelf?',
      body: 'Pertanyaan ini selalu muncul dan memang seharusnya ditanyakan. Sebelum memutuskan membangun custom, kami melakukan evaluasi terhadap beberapa solusi ERP yang tersedia di pasar. Hasilnya: tidak ada yang cocok.\n\nBisnis distribusi FMCG di Indonesia punya karakteristik unik yang jarang diakomodasi oleh ERP global: skema diskon bertingkat yang berbeda per principal, sistem retur yang kompleks, pembayaran tempo yang bervariasi per outlet, dan kebutuhan untuk beroperasi di area dengan konektivitas internet yang tidak stabil. ERP off-the-shelf membutuhkan customization yang begitu banyak hingga biayanya akan melebihi membangun dari nol, dengan risiko ketergantungan pada vendor yang lebih besar.',
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Kompleksitas Bisnis Distribusi',
      solutionHeading: 'Arsitektur Solusi',
      challenges: [
        {
          title: 'Multi-gudang dengan stok berbeda',
          description: 'Setiap gudang punya alokasi stok yang berbeda berdasarkan coverage area dan demand pattern. Transfer antar gudang harus smooth tanpa kehilangan visibility.',
        },
        {
          title: 'Ratusan SKU dengan aturan berbeda',
          description: 'Setiap principal punya aturan bisnis sendiri: batas minimal order, skema diskon bertingkat, kebijakan retur, dan periode pembayaran yang berbeda-beda.',
        },
        {
          title: 'Salesman di lapangan dengan koneksi terbatas',
          description: 'Tim sales yang beroperasi di area rural membutuhkan kemampuan untuk input order dan cek stok bahkan ketika koneksi internet tidak tersedia.',
        },
        {
          title: 'Migrasi dari sistem legacy tanpa downtime',
          description: 'Operasional tidak boleh berhenti satu hari pun. Migrasi harus dilakukan bertahap dengan zero data loss dan minimal disrupsi.',
        },
      ],
      solutions: [
        {
          title: 'Multi-warehouse inventory engine',
          description: 'Sistem inventory terpusat dengan kemampuan alokasi per gudang, transfer tracking real-time, dan automated reorder point berdasarkan historical demand.',
        },
        {
          title: 'Configurable business rules engine',
          description: 'Rules engine yang memungkinkan konfigurasi aturan bisnis per principal tanpa coding. Admin bisa mengatur skema diskon, minimum order, dan kebijakan retur lewat interface.',
        },
        {
          title: 'Offline-first mobile app',
          description: 'Aplikasi mobile untuk salesman yang bisa beroperasi penuh secara offline. Data akan otomatis sync ketika koneksi tersedia, dengan conflict resolution yang cerdas.',
        },
        {
          title: 'Phased migration strategy',
          description: 'Migrasi dilakukan per modul, per gudang. Dimulai dari gudang terkecil sebagai pilot, lalu di-rollout bertahap ke seluruh jaringan dengan parallel running di setiap fase.',
        },
      ],
    },
    {
      type: 'process-steps',
      heading: 'Timeline Pengembangan',
      steps: [
        {
          number: '01',
          title: 'Business Process Deep Dive (Bulan 1)',
          description: 'Kami menerjunkan tim ke gudang, ikut salesman ke lapangan, dan duduk bersama tim finance untuk memahami setiap nuansa proses bisnis. Dokumentasi ini menjadi blueprint pengembangan.',
        },
        {
          number: '02',
          title: 'Core Module Development (Bulan 2-4)',
          description: 'Pengembangan modul inti: inventory management, order processing, dan invoicing. Setiap modul di-test intensif dengan data real dari operasional sehari-hari.',
        },
        {
          number: '03',
          title: 'Mobile App & Offline Capability (Bulan 3-5)',
          description: 'Pengembangan paralel aplikasi mobile untuk salesman dengan kemampuan offline-first. Testing dilakukan di area dengan koneksi terburuk untuk memastikan reliabilitas.',
        },
        {
          number: '04',
          title: 'Integration & Reporting (Bulan 5-6)',
          description: 'Integrasi seluruh modul, pengembangan reporting dashboard, dan koneksi dengan sistem accounting yang sudah ada.',
        },
        {
          number: '05',
          title: 'Pilot & Rollout (Bulan 6-8)',
          description: 'Pilot di satu gudang selama 1 bulan, evaluasi dan refinement, lalu rollout bertahap ke seluruh jaringan dengan training dan pendampingan di setiap lokasi.',
        },
      ],
    },
    {
      type: 'metrics',
      heading: 'Hasil Setelah Full Rollout',
      items: [
        { value: '35%', label: 'Pengurangan stok mati (dead stock)' },
        { value: '98.5%', label: 'Akurasi inventory (dari 92%)' },
        { value: '50%', label: 'Pengurangan biaya maintenance IT' },
        { value: '2x', label: 'Kecepatan order processing' },
      ],
    },
    {
      type: 'highlight',
      heading: 'Pelajaran Terbesar: Sistem Harus Mengikuti Bisnis',
      body: 'Di banyak implementasi ERP, bisnis dipaksa berubah mengikuti sistem. Kami membalikkan paradigma ini. Sistem kami dirancang untuk mengikuti cara bisnis beroperasi, dengan fleksibilitas untuk berkembang seiring berubahnya kebutuhan bisnis. Rules engine yang configurable berarti ketika ada principal baru dengan skema bisnis yang berbeda, tim admin bisa mengakomodasinya sendiri tanpa menunggu developer. Ini bukan hanya efisiensi teknis, tapi otonomi bisnis.',
    },
    {
      type: 'quote',
      text: 'ERP yang baik tidak terasa seperti software baru. Ia terasa seperti cara kerja yang sudah seharusnya dari dulu.',
      attribution: 'Feedback dari operations manager setelah 1 bulan go-live',
    },
  ],
  outcome: {
    heading: 'ERP yang Menjadi Keunggulan Kompetitif',
    body: 'Setelah full rollout, distributor ini tidak hanya mendapatkan efisiensi operasional. Mereka mendapatkan keunggulan kompetitif. Kemampuan untuk onboard principal baru dalam hitungan hari (bukan bulan), visibilitas stok real-time di seluruh jaringan, dan tim sales yang bisa beroperasi di mana pun tanpa kendala koneksi. Biaya maintenance IT turun 50% dibanding sistem legacy, dan yang lebih penting, sistem ini bisa berkembang seiring pertumbuhan bisnis tanpa perlu overhaul besar-besaran.',
  },
  nextProject: { slug: 'inventory-management-retail', title: 'Inventory Management System untuk Retail Chain' },
};

const en: ProjectDetail = {
  slug: 'custom-erp-distributor-fmcg',
  category: 'technology',
  title: 'Custom ERP for FMCG Distributor',
  subtitle: 'Replacing a legacy system with a custom ERP for complex distribution chains.',
  industry: 'FMCG & Distribution',
  year: '2024',
  duration: '8 months',
  overview: 'This large FMCG distributor managed hundreds of SKUs from dozens of principals, distributed to thousands of outlets through a multi-warehouse network across several provinces. Their legacy ERP system was over a decade old: slow, difficult to customize, and maintenance costs kept increasing every year. But replacing an ERP is not a light decision. This is the operational backbone that, if mishandled, could cripple the business. We were asked to build a custom ERP that fits their way of working, not the other way around.',
  sections: [
    {
      type: 'text',
      heading: 'Why Custom, Not Off-the-Shelf?',
      body: 'This question always comes up and rightfully so. Before deciding to build custom, we evaluated several ERP solutions available on the market. The result: none fit.\n\nFMCG distribution businesses in Indonesia have unique characteristics rarely accommodated by global ERPs: tiered discount schemes that differ per principal, complex return systems, varying credit terms per outlet, and the need to operate in areas with unstable internet connectivity. An off-the-shelf ERP would require so much customization that costs would exceed building from scratch, with greater vendor dependency risk.',
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Distribution Business Complexity',
      solutionHeading: 'Solution Architecture',
      challenges: [
        {
          title: 'Multi-warehouse with different stock allocations',
          description: 'Each warehouse had different stock allocations based on coverage area and demand patterns. Inter-warehouse transfers had to be smooth without losing visibility.',
        },
        {
          title: 'Hundreds of SKUs with different rules',
          description: 'Each principal had their own business rules: minimum order quantities, tiered discount schemes, return policies, and varying payment periods.',
        },
        {
          title: 'Field salesmen with limited connectivity',
          description: 'Sales teams operating in rural areas needed the ability to input orders and check stock even when internet connectivity was unavailable.',
        },
        {
          title: 'Legacy migration without downtime',
          description: 'Operations could not stop for even a single day. Migration had to be done gradually with zero data loss and minimal disruption.',
        },
      ],
      solutions: [
        {
          title: 'Multi-warehouse inventory engine',
          description: 'A centralized inventory system with per-warehouse allocation capability, real-time transfer tracking, and automated reorder points based on historical demand.',
        },
        {
          title: 'Configurable business rules engine',
          description: 'A rules engine allowing per-principal business rule configuration without coding. Admin can set discount schemes, minimum orders, and return policies through the interface.',
        },
        {
          title: 'Offline-first mobile app',
          description: 'A mobile app for salesmen that operates fully offline. Data automatically syncs when connectivity is available, with intelligent conflict resolution.',
        },
        {
          title: 'Phased migration strategy',
          description: 'Migration done per module, per warehouse. Starting from the smallest warehouse as pilot, then gradually rolled out to the entire network with parallel running at each phase.',
        },
      ],
    },
    {
      type: 'process-steps',
      heading: 'Development Timeline',
      steps: [
        {
          number: '01',
          title: 'Business Process Deep Dive (Month 1)',
          description: 'We deployed our team to warehouses, joined salesmen in the field, and sat with the finance team to understand every nuance of business processes. This documentation became the development blueprint.',
        },
        {
          number: '02',
          title: 'Core Module Development (Months 2-4)',
          description: 'Development of core modules: inventory management, order processing, and invoicing. Each module was intensively tested with real data from daily operations.',
        },
        {
          number: '03',
          title: 'Mobile App & Offline Capability (Months 3-5)',
          description: 'Parallel development of the mobile app for salesmen with offline-first capability. Testing was done in areas with the worst connectivity to ensure reliability.',
        },
        {
          number: '04',
          title: 'Integration & Reporting (Months 5-6)',
          description: 'Integration of all modules, development of reporting dashboard, and connection with existing accounting systems.',
        },
        {
          number: '05',
          title: 'Pilot & Rollout (Months 6-8)',
          description: 'Pilot at one warehouse for 1 month, evaluation and refinement, then gradual rollout to the entire network with training and support at each location.',
        },
      ],
    },
    {
      type: 'metrics',
      heading: 'Results After Full Rollout',
      items: [
        { value: '35%', label: 'Reduction in dead stock' },
        { value: '98.5%', label: 'Inventory accuracy (from 92%)' },
        { value: '50%', label: 'Reduction in IT maintenance costs' },
        { value: '2x', label: 'Order processing speed' },
      ],
    },
    {
      type: 'highlight',
      heading: 'Biggest Lesson: The System Must Follow the Business',
      body: 'In many ERP implementations, businesses are forced to change to follow the system. We reversed this paradigm. Our system was designed to follow how the business operates, with flexibility to evolve as business needs change. The configurable rules engine means that when a new principal with different business schemes comes on board, the admin team can accommodate it themselves without waiting for developers. This is not just technical efficiency, but business autonomy.',
    },
    {
      type: 'quote',
      text: 'A good ERP does not feel like new software. It feels like the way things should have always worked.',
      attribution: 'Feedback from the operations manager after 1 month live',
    },
  ],
  outcome: {
    heading: 'An ERP That Became a Competitive Advantage',
    body: 'After full rollout, this distributor gained more than operational efficiency. They gained a competitive advantage. The ability to onboard new principals in days (not months), real-time stock visibility across the entire network, and a sales team that can operate anywhere without connectivity constraints. IT maintenance costs dropped 50% compared to the legacy system, and more importantly, the system can grow alongside the business without requiring major overhauls.',
  },
  nextProject: { slug: 'inventory-management-retail', title: 'Inventory Management System for Retail Chain' },
};

registerProject('custom-erp-distributor-fmcg', { id: () => id, en: () => en });
