import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'data-analytics-platform-agritech',
  category: 'technology',
  title: 'Data Analytics Platform untuk Cold Storage Operations',
  subtitle: 'Mengubah data sensor IoT menjadi insight yang actionable untuk operasional gudang berpendingin.',
  industry: 'Warehouse & Cold Storage',
  year: '2024',
  duration: '5 bulan',
  overview: 'Operator cold storage dengan jaringan gudang berpendingin di beberapa kota sudah memasang ratusan sensor IoT: sensor suhu, kelembaban, kualitas udara, dan status pintu di setiap ruangan dan zona penyimpanan. Data mengalir terus-menerus, tapi ironisnya, hampir tidak ada yang bisa memanfaatkannya secara efektif. Data mentah yang menumpuk di server tidak membantu warehouse manager yang harus membuat keputusan cepat saat suhu berfluktuasi atau kapasitas mendekati batas. Kami membangun platform analitik yang menerjemahkan data sensor menjadi alert dan rekomendasi yang bisa langsung ditindaklanjuti.',
  sections: [
    {
      type: 'text',
      heading: 'Gap Antara Data dan Keputusan',
      body: 'Perusahaan ini punya semua data yang dibutuhkan. Tapi antara data dan keputusan yang baik, ada gap yang besar. Angka suhu -18.3 derajat Celsius di monitor tidak berarti apa-apa bagi warehouse manager yang bertanya: "Apakah produk di zona B4 masih aman?" Jawaban untuk pertanyaan itu membutuhkan konteks: jenis produk apa yang disimpan, berapa lama sudah di zona tersebut, apakah ada fluktuasi suhu sebelumnya, dan apa batas toleransi spesifik dari pemilik barang.\n\nPlatform yang dibutuhkan bukan dashboard penuh grafik suhu. Yang dibutuhkan adalah "supervisor digital" yang memahami konteks dan memberikan alert hanya ketika ada yang benar-benar perlu ditindaklanjuti.',
    },
    {
      type: 'gallery-text',
      heading: 'Lapisan Platform yang Kami Bangun',
      body: 'Platform ini terdiri dari empat lapisan yang masing-masing punya peran spesifik dalam mengubah data mentah menjadi aksi.',
      items: [
        {
          label: 'Data Ingestion Layer',
          description: 'Menerima dan membersihkan data dari berbagai tipe sensor dengan format yang berbeda-beda. Termasuk handling untuk data yang hilang atau anomali, yang sering terjadi pada sensor di lingkungan cold storage yang ekstrem.',
        },
        {
          label: 'Context Engine',
          description: 'Lapisan yang menambahkan konteks pada data: profil produk yang disimpan, standar suhu per kategori, SLA dari pemilik barang, dan riwayat zona. Data sensor "-18.3 C" berubah menjadi "suhu zona B4 mendekati batas atas untuk frozen seafood."',
        },
        {
          label: 'Alert & Recommendation Engine',
          description: 'Algoritma yang menghasilkan alert dan rekomendasi spesifik berdasarkan data + konteks. Bukan hanya "suhu naik" tapi "zona B4 perlu pengecekan: suhu naik 2 derajat dalam 30 menit terakhir, kemungkinan pintu tidak tertutup sempurna."',
        },
        {
          label: 'Operations Interface',
          description: 'Interface yang dirancang untuk tim di lapangan: notifikasi via WhatsApp dan aplikasi mobile, dashboard visual yang minimal tapi informatif, dan prioritas yang jelas untuk setiap alert.',
        },
      ],
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Tantangan Unik Cold Storage',
      solutionHeading: 'Solusi yang Kontekstual',
      challenges: [
        {
          title: 'Alert fatigue pada tim operasional',
          description: 'Sebelumnya, setiap fluktuasi suhu kecil memicu alarm. Tim jadi kebal terhadap alert karena 90% nya false positive. Yang berbahaya: alert yang benar-benar kritis ikut diabaikan.',
        },
        {
          title: 'Standar berbeda untuk setiap produk',
          description: 'Frozen meat, seafood, dairy, farmasi, dan buah beku punya batas suhu dan toleransi yang berbeda-beda. Satu gudang bisa menyimpan belasan kategori sekaligus.',
        },
        {
          title: 'Compliance dan audit trail',
          description: 'Regulasi food safety dan farmasi mengharuskan pencatatan suhu yang kontinu dan bisa diaudit. Proses ini masih dilakukan manual dengan checklist kertas setiap beberapa jam.',
        },
        {
          title: 'Sensor di lingkungan ekstrem',
          description: 'Sensor di ruangan -25 derajat Celsius menghadapi kondisi berat. Embun beku, kondensasi, dan perubahan suhu saat pintu dibuka membuat data sering mengandung noise dan anomali.',
        },
      ],
      solutions: [
        {
          title: 'Smart alerting dengan threshold kontekstual',
          description: 'Alert yang memperhitungkan konteks: jenis produk di zona tersebut, durasi deviasi, tren suhu, dan apakah sedang ada aktivitas bongkar muat. False positive turun drastis.',
        },
        {
          title: 'Per-zone product profiling',
          description: 'Setiap zona penyimpanan mendapatkan profil yang di-customize berdasarkan kategori produk dan SLA pemilik barang. Batas toleransi dan eskalasi otomatis mengikuti profil.',
        },
        {
          title: 'Automated compliance logging',
          description: 'Pencatatan suhu otomatis setiap menit yang langsung tersimpan dalam format yang siap audit. Laporan compliance bisa di-generate dalam hitungan detik.',
        },
        {
          title: 'Robust data pipeline',
          description: 'Pipeline data yang otomatis mendeteksi dan menangani anomali sensor: interpolasi untuk gaps saat pintu dibuka, filtering untuk spike data, dan alerting untuk sensor yang perlu maintenance.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Operator gudang tidak butuh big data. Mereka butuh jawaban cepat: apakah semua produk di gudang ini aman sekarang, dan apa yang perlu saya lakukan?',
      attribution: 'Insight dari observasi operasional di minggu pertama',
    },
    {
      type: 'process-steps',
      heading: 'Pendekatan Pengembangan',
      steps: [
        {
          number: '01',
          title: 'Operations Immersion',
          description: 'Tim kami menghabiskan 1 minggu di gudang, mengikuti shift pagi dan malam, memahami ritme kerja operator, dan melihat bagaimana mereka merespons situasi darurat. Insight ini membentuk seluruh desain platform.',
        },
        {
          number: '02',
          title: 'Data Pipeline Setup',
          description: 'Membangun infrastruktur untuk menerima, membersihkan, dan menyimpan data dari ratusan sensor. Termasuk monitoring untuk memastikan data terus mengalir tanpa gangguan.',
        },
        {
          number: '03',
          title: 'Algorithm Development',
          description: 'Mengembangkan model alert menggunakan data historis dan standar cold chain. Setiap model divalidasi dengan tim operasional dan compliance sebelum di-deploy.',
        },
        {
          number: '04',
          title: 'Interface Design & Testing',
          description: 'Desain interface yang di-test langsung dengan warehouse manager dan operator di lapangan. Iterasi berulang kali sampai menemukan format alert yang benar-benar membantu, bukan mengganggu.',
        },
        {
          number: '05',
          title: 'Pilot di 2 Gudang',
          description: 'Pilot selama 2 bulan di dua gudang dengan karakteristik berbeda: gudang frozen food dan gudang farmasi. Feedback dari setiap lokasi memperkaya kemampuan platform.',
        },
      ],
    },
    {
      type: 'metrics',
      heading: 'Hasil Pilot',
      items: [
        { value: '90%', label: 'Pengurangan false positive alert' },
        { value: '35%', label: 'Pengurangan product spoilage' },
        { value: '100%', label: 'Compliance audit tercatat otomatis' },
        { value: '18%', label: 'Penghematan biaya energi pendinginan' },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'Teknologi monitoring yang paling canggih bukan yang paling banyak mengirim alert. Tapi yang paling tepat memberi tahu kapan harus bertindak dan kapan semuanya baik-baik saja.',
    },
  ],
  outcome: {
    heading: 'Dari Data ke Ketenangan Pikiran',
    body: 'Platform ini sekarang aktif di seluruh jaringan gudang. Tapi pencapaian terbesar bukan di metrik teknis. Pencapaian terbesar adalah ketika warehouse manager yang dulunya harus bolak-balik cek suhu manual setiap jam sekarang bisa tenang karena tahu sistem akan memberi tahu jika ada yang tidak beres. Tim operasional yang dulunya kebal terhadap alert sekarang merespons setiap notifikasi karena mereka tahu setiap alert yang muncul memang perlu ditindaklanjuti. Spoilage turun, compliance tercatat otomatis, dan biaya energi lebih efisien karena sistem bisa mendeteksi inefisiensi pendinginan yang tidak terlihat oleh mata manusia.',
  },
  nextProject: { slug: 'business-process-optimization', title: 'Business Process Optimization Lintas Industri' },
};

const en: ProjectDetail = {
  slug: 'data-analytics-platform-agritech',
  category: 'technology',
  title: 'Data Analytics Platform for Cold Storage Operations',
  subtitle: 'Turning IoT sensor data into actionable insights for cold storage operations.',
  industry: 'Warehouse & Cold Storage',
  year: '2024',
  duration: '5 months',
  overview: 'A cold storage operator with a network of refrigerated warehouses across several cities had installed hundreds of IoT sensors: temperature, humidity, air quality, and door status sensors in every room and storage zone. Data flowed continuously, but ironically, almost no one could effectively use it. Raw data piling up on servers did not help warehouse managers who needed to make quick decisions when temperatures fluctuated or capacity approached limits. We built an analytics platform that translates sensor data into alerts and recommendations that are immediately actionable.',
  sections: [
    {
      type: 'text',
      heading: 'The Gap Between Data and Decisions',
      body: 'This company had all the data they needed. But between data and good decisions, there is a large gap. A temperature reading of -18.3 degrees Celsius on a monitor means nothing to a warehouse manager asking: "Are the products in zone B4 still safe?" Answering that question requires context: what type of product is stored, how long it has been in that zone, whether there were previous temperature fluctuations, and what the specific tolerance limits from the goods owner are.\n\nWhat was needed was not a dashboard full of temperature charts. What was needed was a "digital supervisor" that understands context and alerts only when something truly needs attention.',
    },
    {
      type: 'gallery-text',
      heading: 'Platform Layers We Built',
      body: 'The platform consists of four layers, each with a specific role in transforming raw data into action.',
      items: [
        {
          label: 'Data Ingestion Layer',
          description: 'Receives and cleans data from various sensor types with different formats. Includes handling for missing data and anomalies, common with sensors in extreme cold storage environments.',
        },
        {
          label: 'Context Engine',
          description: 'A layer that adds context to data: stored product profiles, temperature standards per category, goods owner SLAs, and zone history. Sensor data of "-18.3 C" becomes "zone B4 temperature approaching upper limit for frozen seafood."',
        },
        {
          label: 'Alert & Recommendation Engine',
          description: 'An algorithm that generates specific alerts and recommendations based on data + context. Not just "temperature rising" but "zone B4 needs checking: temperature rose 2 degrees in the last 30 minutes, possible door not fully closed."',
        },
        {
          label: 'Operations Interface',
          description: 'An interface designed for field teams: notifications via WhatsApp and mobile app, a minimal but informative visual dashboard, and clear priorities for each alert.',
        },
      ],
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Unique Cold Storage Challenges',
      solutionHeading: 'Contextual Solutions',
      challenges: [
        {
          title: 'Alert fatigue in operations teams',
          description: 'Previously, every small temperature fluctuation triggered an alarm. The team became immune to alerts because 90% were false positives. The dangerous part: truly critical alerts were also ignored.',
        },
        {
          title: 'Different standards for each product',
          description: 'Frozen meat, seafood, dairy, pharmaceuticals, and frozen fruits all have different temperature limits and tolerances. A single warehouse can store over a dozen categories simultaneously.',
        },
        {
          title: 'Compliance and audit trails',
          description: 'Food safety and pharmaceutical regulations require continuous, auditable temperature records. This process was still done manually with paper checklists every few hours.',
        },
        {
          title: 'Sensors in extreme environments',
          description: 'Sensors in -25 degree Celsius rooms face harsh conditions. Frost buildup, condensation, and temperature changes when doors open cause data to frequently contain noise and anomalies.',
        },
      ],
      solutions: [
        {
          title: 'Smart alerting with contextual thresholds',
          description: 'Alerts that consider context: product type in that zone, deviation duration, temperature trends, and whether loading/unloading is in progress. False positives dropped dramatically.',
        },
        {
          title: 'Per-zone product profiling',
          description: 'Each storage zone gets a customized profile based on product category and goods owner SLA. Tolerance limits and automatic escalation follow the profile.',
        },
        {
          title: 'Automated compliance logging',
          description: 'Automatic temperature recording every minute, stored in audit-ready format. Compliance reports can be generated in seconds.',
        },
        {
          title: 'Robust data pipeline',
          description: 'A data pipeline that automatically detects and handles sensor anomalies: interpolation for gaps when doors open, filtering for data spikes, and alerting for sensors needing maintenance.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Warehouse operators do not need big data. They need a quick answer: are all products in this warehouse safe right now, and what do I need to do?',
      attribution: 'Insight from operational observation in the first week',
    },
    {
      type: 'process-steps',
      heading: 'Development Approach',
      steps: [
        {
          number: '01',
          title: 'Operations Immersion',
          description: 'Our team spent 1 week in the warehouses, following morning and night shifts, understanding operator work rhythms, and observing how they respond to emergency situations. These insights shaped the entire platform design.',
        },
        {
          number: '02',
          title: 'Data Pipeline Setup',
          description: 'Building infrastructure to receive, clean, and store data from hundreds of sensors. Including monitoring to ensure data flows continuously without interruption.',
        },
        {
          number: '03',
          title: 'Algorithm Development',
          description: 'Developing alert models using historical data and cold chain standards. Each model was validated with operations and compliance teams before deployment.',
        },
        {
          number: '04',
          title: 'Interface Design & Testing',
          description: 'Interface design tested directly with warehouse managers and operators in the field. Iterated multiple times until finding an alert format that truly helps, not annoys.',
        },
        {
          number: '05',
          title: 'Pilot at 2 Warehouses',
          description: 'A 2-month pilot at two warehouses with different characteristics: a frozen food warehouse and a pharmaceutical warehouse. Feedback from each location enriched the platform\'s capabilities.',
        },
      ],
    },
    {
      type: 'metrics',
      heading: 'Pilot Results',
      items: [
        { value: '90%', label: 'Reduction in false positive alerts' },
        { value: '35%', label: 'Reduction in product spoilage' },
        { value: '100%', label: 'Compliance audit automatically logged' },
        { value: '18%', label: 'Energy cost savings on cooling' },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'The most advanced monitoring technology is not the one that sends the most alerts. It is the one that most accurately tells you when to act and when everything is fine.',
    },
  ],
  outcome: {
    heading: 'From Data to Peace of Mind',
    body: 'This platform is now active across the entire warehouse network. But the greatest achievement is not in technical metrics. The greatest achievement is when warehouse managers who used to manually check temperatures every hour can now rest easy knowing the system will notify them if something is wrong. Operations teams that were once immune to alerts now respond to every notification because they know each alert that appears truly needs action. Spoilage is down, compliance is automatically recorded, and energy costs are more efficient because the system can detect cooling inefficiencies invisible to the human eye.',
  },
  nextProject: { slug: 'business-process-optimization', title: 'Business Process Optimization Lintas Industri' },
};

registerProject('data-analytics-platform-agritech', { id: () => id, en: () => en });
