import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'inventory-management-retail',
  category: 'technology',
  title: 'Inventory Management System untuk Retail Chain',
  subtitle: 'Visibilitas stok real-time dan otomasi restock di puluhan toko.',
  industry: 'Retail',
  year: '2024',
  duration: '4 bulan',
  overview: 'Jaringan retail dengan puluhan toko yang tersebar di beberapa kota menghadapi masalah klasik: toko yang satu kehabisan stok sementara toko lain menumpuk barang yang sama. Proses restock masih manual, bergantung pada intuisi store manager yang menelepon ke gudang pusat. Tidak ada data yang bisa diandalkan untuk menentukan kapan dan berapa banyak barang harus dikirim ke masing-masing toko. Kami membangun sistem inventory management yang memberikan visibilitas real-time dan otomasi restock berbasis data.',
  sections: [
    {
      type: 'highlight',
      heading: 'Masalah yang Terlihat Sederhana tapi Sebenarnya Tidak',
      body: 'Dari luar, solusinya terdengar mudah: pasang barcode scanner di setiap toko, hubungkan ke database pusat, dan buat dashboard. Tapi realitanya, manajemen inventory di retail chain punya lapisan kompleksitas yang sering tidak terlihat. Setiap toko punya demand pattern yang berbeda berdasarkan lokasi, demografi, dan even musim. Barang yang fast-moving di toko A bisa jadi slow-moving di toko B. Lead time pengiriman dari gudang ke setiap toko berbeda-beda. Dan store manager sering meng-"hoard" stok populer karena takut kehabisan, yang justru membuat toko lain kekurangan.',
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Tantangan di Lapangan',
      solutionHeading: 'Solusi Terintegrasi',
      challenges: [
        {
          title: 'Stok tidak merata antar toko',
          description: 'Beberapa toko overstock hingga 40% untuk item tertentu sementara toko lain stockout. Tanpa visibility terpusat, tidak ada cara untuk melakukan redistribusi yang efisien.',
        },
        {
          title: 'Restock berbasis "feeling"',
          description: 'Store manager memesan berdasarkan pengalaman dan intuisi. Hasilnya tidak konsisten: kadang terlalu banyak, kadang terlalu sedikit, dan sering kali terlambat.',
        },
        {
          title: 'Shrinkage yang tidak terdeteksi',
          description: 'Selisih antara stok di sistem dan stok fisik sering ditemukan saat stock opname tahunan. Pada saat itu, kerugian sudah terjadi dan sulit ditelusuri penyebabnya.',
        },
      ],
      solutions: [
        {
          title: 'Real-time inventory visibility',
          description: 'Setiap transaksi di setiap toko ter-update secara real-time ke database pusat. Manajemen bisa melihat posisi stok seluruh jaringan dalam satu dashboard.',
        },
        {
          title: 'Smart reorder engine',
          description: 'Algoritma yang menghitung reorder point dan quantity berdasarkan historical sales pattern, lead time, dan safety stock level yang berbeda untuk setiap toko.',
        },
        {
          title: 'Continuous cycle counting',
          description: 'Menggantikan stock opname tahunan dengan cycle counting harian yang terotomasi. Setiap hari, sistem memilih sejumlah SKU untuk dicek, sehingga seluruh inventory terverifikasi secara rolling.',
        },
      ],
    },
    {
      type: 'two-column',
      left: {
        heading: 'Untuk Store Manager',
        body: 'Interface yang simple dan actionable. Dashboard menampilkan item mana yang perlu di-count hari ini, alert untuk stok yang menipis, dan rekomendasi reorder yang tinggal di-approve. Tidak perlu lagi menghitung manual atau menelepon gudang. Semua informasi yang dibutuhkan ada di satu layar, dioptimalkan untuk tablet yang digunakan di toko.',
      },
      right: {
        heading: 'Untuk Manajemen Pusat',
        body: 'Dashboard operasional yang menampilkan health score setiap toko berdasarkan inventory turnover, stockout rate, dan shrinkage level. Analitik yang membantu identifikasi tren dan anomali. Dan kemampuan untuk melakukan redistribusi stok antar toko secara proaktif sebelum terjadi stockout, berdasarkan prediksi demand.',
      },
    },
    {
      type: 'process-steps',
      heading: 'Strategi Implementasi',
      steps: [
        {
          number: '01',
          title: 'Data Foundation',
          description: 'Membangun master data yang bersih: katalog produk terstandardisasi, mapping lokasi gudang dan toko, dan baseline stok awal yang akurat melalui full stock opname.',
        },
        {
          number: '02',
          title: 'Core System Build',
          description: 'Pengembangan sistem inti: real-time inventory tracking, dashboard, dan reporting. Integrasi dengan POS system yang sudah ada di setiap toko.',
        },
        {
          number: '03',
          title: 'Algorithm Calibration',
          description: 'Menggunakan data historis 12 bulan untuk melatih dan mengkalibrasi algoritma reorder. Setiap toko mendapatkan parameter yang di-customize berdasarkan pola demand spesifiknya.',
        },
        {
          number: '04',
          title: 'Pilot di 5 Toko',
          description: 'Pilot selama 1 bulan di 5 toko yang mewakili berbagai tipe lokasi: mall, ruko, dan standalone. Evaluasi performa dan refinement sebelum rollout.',
        },
        {
          number: '05',
          title: 'Rollout Bertahap',
          description: 'Rollout ke seluruh jaringan dalam batch 5-10 toko per minggu, dengan training on-site dan support hotline yang dedicated selama masa transisi.',
        },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'Data yang akurat bukan tujuan akhir. Data yang akurat adalah fondasi untuk membuat keputusan yang lebih baik setiap hari.',
    },
    {
      type: 'metrics',
      heading: 'Dampak Bisnis',
      items: [
        { value: '72%', label: 'Pengurangan stockout events' },
        { value: '28%', label: 'Pengurangan overstock value' },
        { value: '4%', label: 'Shrinkage rate (turun dari 8.5%)' },
        { value: '15%', label: 'Peningkatan inventory turnover' },
      ],
    },
  ],
  outcome: {
    heading: 'Inventory yang Bekerja untuk Bisnis, Bukan Sebaliknya',
    body: 'Dalam 3 bulan setelah full rollout, hasilnya terlihat jelas di bottom line. Stockout berkurang drastis yang berarti lebih sedikit lost sales. Overstock juga berkurang yang berarti modal kerja lebih efisien. Shrinkage yang dulunya "biaya tersembunyi" sekarang terdeteksi lebih awal. Tapi yang paling berdampak adalah perubahan cara kerja: store manager tidak lagi menghabiskan jam-jam pertama mereka menghitung stok dan menelepon gudang. Mereka bisa fokus pada apa yang seharusnya menjadi tugas utama mereka: melayani pelanggan dan mengembangkan penjualan.',
  },
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
  overview: 'A retail chain with dozens of stores spread across several cities faced a classic problem: one store runs out of stock while another hoards the same items. Restocking was still manual, relying on store managers calling the central warehouse based on intuition. There was no reliable data to determine when and how much stock to send to each store. We built an inventory management system that provides real-time visibility and data-driven restocking automation.',
  sections: [
    {
      type: 'highlight',
      heading: 'A Problem That Looks Simple but Really Is Not',
      body: 'From the outside, the solution sounds easy: install barcode scanners at every store, connect to a central database, and build a dashboard. But in reality, inventory management in a retail chain has layers of complexity that are often invisible. Each store has different demand patterns based on location, demographics, and even seasons. Fast-moving items at store A can be slow-moving at store B. Delivery lead times from warehouse to each store vary. And store managers often "hoard" popular stock out of fear of running out, which actually causes shortages at other stores.',
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Field Challenges',
      solutionHeading: 'Integrated Solution',
      challenges: [
        {
          title: 'Uneven stock across stores',
          description: 'Some stores were overstocked by up to 40% on certain items while others were stocked out. Without centralized visibility, there was no way to redistribute efficiently.',
        },
        {
          title: 'Restock based on "gut feeling"',
          description: 'Store managers ordered based on experience and intuition. Results were inconsistent: sometimes too much, sometimes too little, and often too late.',
        },
        {
          title: 'Undetected shrinkage',
          description: 'Discrepancies between system stock and physical stock were often discovered during annual stock takes. By then, losses had already occurred and causes were hard to trace.',
        },
      ],
      solutions: [
        {
          title: 'Real-time inventory visibility',
          description: 'Every transaction at every store updates in real-time to the central database. Management can view stock positions across the entire network on one dashboard.',
        },
        {
          title: 'Smart reorder engine',
          description: 'An algorithm that calculates reorder points and quantities based on historical sales patterns, lead times, and safety stock levels customized for each store.',
        },
        {
          title: 'Continuous cycle counting',
          description: 'Replacing annual stock takes with automated daily cycle counts. Each day, the system selects a set of SKUs to check, so the entire inventory is verified on a rolling basis.',
        },
      ],
    },
    {
      type: 'two-column',
      left: {
        heading: 'For Store Managers',
        body: 'A simple and actionable interface. The dashboard shows which items need counting today, alerts for low stock, and reorder recommendations that just need approval. No more manual counting or calling the warehouse. All needed information on one screen, optimized for the tablets used in stores.',
      },
      right: {
        heading: 'For Central Management',
        body: 'An operational dashboard showing the health score of each store based on inventory turnover, stockout rate, and shrinkage level. Analytics that help identify trends and anomalies. And the ability to proactively redistribute stock between stores before stockouts occur, based on demand predictions.',
      },
    },
    {
      type: 'process-steps',
      heading: 'Implementation Strategy',
      steps: [
        {
          number: '01',
          title: 'Data Foundation',
          description: 'Building clean master data: standardized product catalog, warehouse and store location mapping, and accurate baseline stock through a full stock take.',
        },
        {
          number: '02',
          title: 'Core System Build',
          description: 'Development of the core system: real-time inventory tracking, dashboard, and reporting. Integration with existing POS systems at every store.',
        },
        {
          number: '03',
          title: 'Algorithm Calibration',
          description: 'Using 12 months of historical data to train and calibrate the reorder algorithm. Each store gets customized parameters based on its specific demand patterns.',
        },
        {
          number: '04',
          title: 'Pilot at 5 Stores',
          description: 'A 1-month pilot at 5 stores representing various location types: mall, shophouse, and standalone. Performance evaluation and refinement before rollout.',
        },
        {
          number: '05',
          title: 'Phased Rollout',
          description: 'Rollout to the entire network in batches of 5-10 stores per week, with on-site training and a dedicated support hotline during the transition period.',
        },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'Accurate data is not the end goal. Accurate data is the foundation for making better decisions every day.',
    },
    {
      type: 'metrics',
      heading: 'Business Impact',
      items: [
        { value: '72%', label: 'Reduction in stockout events' },
        { value: '28%', label: 'Reduction in overstock value' },
        { value: '4%', label: 'Shrinkage rate (down from 8.5%)' },
        { value: '15%', label: 'Improvement in inventory turnover' },
      ],
    },
  ],
  outcome: {
    heading: 'Inventory That Works for the Business, Not the Other Way Around',
    body: 'Within 3 months of full rollout, results were clearly visible on the bottom line. Stockouts decreased dramatically, meaning fewer lost sales. Overstock also decreased, meaning more efficient working capital. Shrinkage, once a "hidden cost," is now detected earlier. But the most impactful change is in how people work: store managers no longer spend their first hours counting stock and calling the warehouse. They can focus on what should be their primary job: serving customers and growing sales.',
  },
  nextProject: { slug: 'hr-payroll-automation', title: 'HR & Payroll Automation Platform' },
};

registerProject('inventory-management-retail', { id: () => id, en: () => en });
