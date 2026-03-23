import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'data-analytics-platform-agritech',
  category: 'technology',
  title: 'Data Analytics Platform untuk Agritech',
  subtitle: 'Mengubah data sensor IoT menjadi insight yang actionable untuk petani.',
  industry: 'Agriculture Technology',
  year: '2024',
  duration: '5 bulan',
  overview: 'Perusahaan agritech ini sudah memasang ribuan sensor IoT di lahan-lahan pertanian: sensor kelembaban tanah, suhu udara, curah hujan, dan intensitas cahaya. Data mengalir terus-menerus, tapi ironisnya, hampir tidak ada yang bisa memanfaatkannya. Data mentah yang menumpuk di server tidak berarti apa-apa bagi petani yang perlu membuat keputusan cepat: kapan harus menyiram, kapan harus memupuk, kapan harus panen. Kami membangun platform analitik yang menerjemahkan data sensor menjadi rekomendasi yang sederhana dan bisa langsung ditindaklanjuti.',
  sections: [
    {
      type: 'text',
      heading: 'Gap Antara Data dan Keputusan',
      body: 'Perusahaan agritech ini punya semua data yang dibutuhkan. Tapi antara data dan keputusan yang baik, ada gap yang besar. Data kelembaban tanah 45% tidak berarti apa-apa bagi petani yang bertanya: "Apakah saya perlu menyiram hari ini?" Jawaban untuk pertanyaan itu membutuhkan konteks: jenis tanaman apa yang ditanam, fase pertumbuhan tanaman, prakiraan cuaca beberapa hari ke depan, dan kondisi tanah spesifik lahan tersebut.\n\nPlatform yang dibutuhkan bukan dashboard penuh grafik. Yang dibutuhkan adalah "penasihat digital" yang memahami konteks dan memberikan saran dalam bahasa yang dipahami petani.',
    },
    {
      type: 'gallery-text',
      heading: 'Lapisan Platform yang Kami Bangun',
      body: 'Platform ini terdiri dari empat lapisan yang masing-masing punya peran spesifik dalam mengubah data mentah menjadi aksi.',
      items: [
        {
          label: 'Data Ingestion Layer',
          description: 'Menerima dan membersihkan data dari berbagai tipe sensor dengan format yang berbeda-beda. Termasuk handling untuk data yang hilang atau anomali, yang sering terjadi pada sensor di lingkungan outdoor.',
        },
        {
          label: 'Context Engine',
          description: 'Lapisan yang menambahkan konteks pada data: profil tanaman, kalender tanam, data cuaca, dan karakteristik lahan. Data sensor "45% kelembaban" berubah menjadi "kelembaban tanah di bawah optimal untuk padi fase bunting."',
        },
        {
          label: 'Recommendation Engine',
          description: 'Algoritma yang menghasilkan rekomendasi spesifik berdasarkan data + konteks. Bukan hanya "kelembaban rendah" tapi "disarankan irigasi 30 menit dalam 6 jam ke depan berdasarkan prakiraan tidak ada hujan."',
        },
        {
          label: 'Farmer Interface',
          description: 'Interface yang dirancang khusus untuk pengguna di lapangan: notifikasi via SMS dan WhatsApp, dashboard visual yang minimal tapi informatif, dan bahasa yang sederhana tanpa jargon teknis.',
        },
      ],
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Tantangan Unik Agritech',
      solutionHeading: 'Solusi yang Kontekstual',
      challenges: [
        {
          title: 'Pengguna akhir bukan tech-savvy',
          description: 'Petani adalah end user utama platform ini. Mereka tidak terbiasa dengan dashboard dan grafik. Interface harus sesederhana membaca pesan WhatsApp.',
        },
        {
          title: 'Konektivitas yang tidak stabil',
          description: 'Banyak lahan pertanian berada di area dengan sinyal internet yang lemah atau tidak ada sama sekali. Platform harus bisa bekerja dalam kondisi koneksi yang tidak ideal.',
        },
        {
          title: 'Setiap lahan unik',
          description: 'Rekomendasi yang tepat untuk satu lahan bisa salah untuk lahan yang lain, meskipun lokasinya berdekatan. Variabel seperti jenis tanah, elevasi, dan drainase membuat setiap lahan perlu pendekatan berbeda.',
        },
        {
          title: 'Data sensor yang "kotor"',
          description: 'Sensor di lapangan menghadapi kondisi ekstrem: panas, hujan, hewan, dan vandalisme. Data yang masuk sering mengandung noise, gaps, dan outlier yang harus difilter sebelum bisa dianalisis.',
        },
      ],
      solutions: [
        {
          title: 'WhatsApp-first interface',
          description: 'Rekomendasi utama dikirim via WhatsApp dalam format yang familiar. Dashboard web menjadi optional untuk pengguna yang ingin informasi lebih detail.',
        },
        {
          title: 'Edge computing & SMS fallback',
          description: 'Pemrosesan data awal dilakukan di edge device dekat lahan. Untuk area tanpa internet, rekomendasi kritis dikirim via SMS.',
        },
        {
          title: 'Per-field calibration',
          description: 'Setiap lahan mendapatkan profil individual yang dikalibrasi berdasarkan data historis dan input dari petani tentang karakteristik lahan mereka.',
        },
        {
          title: 'Robust data pipeline',
          description: 'Pipeline data yang otomatis mendeteksi dan menangani data anomali: interpolasi untuk gaps, filtering untuk outlier, dan alerting untuk sensor yang malfunction.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Petani tidak butuh big data. Petani butuh jawaban yang tepat untuk pertanyaan yang sederhana: apa yang harus saya lakukan hari ini?',
      attribution: 'Insight dari field research di minggu pertama',
    },
    {
      type: 'process-steps',
      heading: 'Pendekatan Pengembangan',
      steps: [
        {
          number: '01',
          title: 'Field Immersion',
          description: 'Tim kami menghabiskan 1 minggu di lapangan, bicara langsung dengan petani, memahami ritme kerja mereka, dan melihat bagaimana mereka membuat keputusan sehari-hari. Insight ini membentuk seluruh desain platform.',
        },
        {
          number: '02',
          title: 'Data Pipeline Setup',
          description: 'Membangun infrastruktur untuk menerima, membersihkan, dan menyimpan data dari ribuan sensor. Termasuk monitoring untuk memastikan data terus mengalir tanpa gangguan.',
        },
        {
          number: '03',
          title: 'Algorithm Development',
          description: 'Mengembangkan model rekomendasi menggunakan data historis dan pengetahuan agronomi. Setiap model divalidasi dengan pakar pertanian sebelum di-deploy.',
        },
        {
          number: '04',
          title: 'Interface Design & Testing',
          description: 'Desain interface yang di-test langsung dengan petani di lapangan. Iterasi berulang kali sampai menemukan format komunikasi yang benar-benar dipahami dan dipercaya.',
        },
        {
          number: '05',
          title: 'Pilot di 3 Lokasi',
          description: 'Pilot selama 2 bulan di tiga lahan dengan karakteristik berbeda: sawah irigasi, lahan kering, dan perkebunan. Feedback dari setiap lokasi memperkaya kemampuan platform.',
        },
      ],
    },
    {
      type: 'metrics',
      heading: 'Hasil Pilot',
      items: [
        { value: '22%', label: 'Peningkatan efisiensi penggunaan air' },
        { value: '15%', label: 'Peningkatan yield di lahan pilot' },
        { value: '90%', label: 'Petani mengikuti rekomendasi platform' },
        { value: '8rb+', label: 'Data point diproses per hari per lahan' },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'Teknologi pertanian yang paling canggih bukan yang paling kompleks. Tapi yang paling sederhana untuk dipahami oleh orang yang paling penting: petani.',
    },
  ],
  outcome: {
    heading: 'Dari Data ke Dampak Nyata di Lapangan',
    body: 'Platform ini sekarang aktif di ratusan hektar lahan pertanian. Tapi pencapaian terbesar bukan di metrik teknis. Pencapaian terbesar adalah ketika petani yang awalnya skeptis dengan teknologi mulai mempercayai rekomendasi platform dan melihat hasilnya langsung di panen mereka. Salah satu petani di lokasi pilot berkomentar bahwa platform ini seperti "punya teman yang ngerti tanaman dan selalu bisa ditanya." Itulah ukuran kesuksesan yang sebenarnya: teknologi yang tidak terasa seperti teknologi.',
  },
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
  overview: 'This agritech company had installed thousands of IoT sensors across farmlands: soil moisture sensors, air temperature, rainfall, and light intensity. Data flowed continuously, but ironically, almost no one could make use of it. Raw data piling up on servers meant nothing to farmers who needed to make quick decisions: when to irrigate, when to fertilize, when to harvest. We built an analytics platform that translates sensor data into recommendations that are simple and immediately actionable.',
  sections: [
    {
      type: 'text',
      heading: 'The Gap Between Data and Decisions',
      body: 'This agritech company had all the data they needed. But between data and good decisions, there is a large gap. A soil moisture reading of 45% means nothing to a farmer asking: "Do I need to irrigate today?" Answering that question requires context: what type of crop is planted, the growth phase, weather forecasts for the coming days, and the specific soil conditions of that field.\n\nWhat was needed was not a dashboard full of charts. What was needed was a "digital advisor" that understands context and gives advice in language that farmers understand.',
    },
    {
      type: 'gallery-text',
      heading: 'Platform Layers We Built',
      body: 'The platform consists of four layers, each with a specific role in transforming raw data into action.',
      items: [
        {
          label: 'Data Ingestion Layer',
          description: 'Receives and cleans data from various sensor types with different formats. Includes handling for missing data and anomalies, which are common with outdoor sensors.',
        },
        {
          label: 'Context Engine',
          description: 'A layer that adds context to data: crop profiles, planting calendars, weather data, and field characteristics. Sensor data of "45% moisture" becomes "soil moisture below optimal for rice in booting phase."',
        },
        {
          label: 'Recommendation Engine',
          description: 'An algorithm that generates specific recommendations based on data + context. Not just "low moisture" but "irrigation of 30 minutes recommended within the next 6 hours based on no rain forecast."',
        },
        {
          label: 'Farmer Interface',
          description: 'An interface designed specifically for field users: notifications via SMS and WhatsApp, a minimal but informative visual dashboard, and simple language without technical jargon.',
        },
      ],
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Unique Agritech Challenges',
      solutionHeading: 'Contextual Solutions',
      challenges: [
        {
          title: 'End users are not tech-savvy',
          description: 'Farmers are the primary end users of this platform. They are not accustomed to dashboards and charts. The interface had to be as simple as reading a WhatsApp message.',
        },
        {
          title: 'Unstable connectivity',
          description: 'Many farmlands are in areas with weak or no internet signal. The platform had to work under non-ideal connectivity conditions.',
        },
        {
          title: 'Every field is unique',
          description: 'Recommendations right for one field could be wrong for another, even if they are adjacent. Variables like soil type, elevation, and drainage make each field require a different approach.',
        },
        {
          title: '"Dirty" sensor data',
          description: 'Sensors in the field face extreme conditions: heat, rain, animals, and vandalism. Incoming data often contains noise, gaps, and outliers that must be filtered before analysis.',
        },
      ],
      solutions: [
        {
          title: 'WhatsApp-first interface',
          description: 'Primary recommendations sent via WhatsApp in a familiar format. The web dashboard is optional for users wanting more detailed information.',
        },
        {
          title: 'Edge computing & SMS fallback',
          description: 'Initial data processing done on edge devices near the field. For areas without internet, critical recommendations sent via SMS.',
        },
        {
          title: 'Per-field calibration',
          description: 'Each field gets an individual profile calibrated based on historical data and farmer input about their field characteristics.',
        },
        {
          title: 'Robust data pipeline',
          description: 'A data pipeline that automatically detects and handles anomalous data: interpolation for gaps, filtering for outliers, and alerting for malfunctioning sensors.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Farmers do not need big data. Farmers need the right answer to a simple question: what should I do today?',
      attribution: 'Insight from field research in the first week',
    },
    {
      type: 'process-steps',
      heading: 'Development Approach',
      steps: [
        {
          number: '01',
          title: 'Field Immersion',
          description: 'Our team spent 1 week in the field, talking directly with farmers, understanding their work rhythm, and observing how they make daily decisions. These insights shaped the entire platform design.',
        },
        {
          number: '02',
          title: 'Data Pipeline Setup',
          description: 'Building infrastructure to receive, clean, and store data from thousands of sensors. Including monitoring to ensure data flows continuously without interruption.',
        },
        {
          number: '03',
          title: 'Algorithm Development',
          description: 'Developing recommendation models using historical data and agronomic knowledge. Each model was validated with agricultural experts before deployment.',
        },
        {
          number: '04',
          title: 'Interface Design & Testing',
          description: 'Interface design tested directly with farmers in the field. Iterated multiple times until finding a communication format that is truly understood and trusted.',
        },
        {
          number: '05',
          title: 'Pilot at 3 Locations',
          description: 'A 2-month pilot at three fields with different characteristics: irrigated rice paddies, dryland, and plantations. Feedback from each location enriched the platform\'s capabilities.',
        },
      ],
    },
    {
      type: 'metrics',
      heading: 'Pilot Results',
      items: [
        { value: '22%', label: 'Improvement in water usage efficiency' },
        { value: '15%', label: 'Yield increase in pilot fields' },
        { value: '90%', label: 'Farmers following platform recommendations' },
        { value: '8K+', label: 'Data points processed daily per field' },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'The most advanced agricultural technology is not the most complex. It is the simplest to understand for the person who matters most: the farmer.',
    },
  ],
  outcome: {
    heading: 'From Data to Real Impact in the Field',
    body: 'This platform is now active across hundreds of hectares of farmland. But the greatest achievement is not in technical metrics. The greatest achievement is when farmers who were initially skeptical of technology began trusting the platform\'s recommendations and seeing results directly in their harvest. One farmer at a pilot location commented that this platform is like "having a friend who understands crops and is always available to ask." That is the true measure of success: technology that does not feel like technology.',
  },
  nextProject: { slug: 'business-process-optimization', title: 'Cross-Industry Business Process Optimization' },
};

registerProject('data-analytics-platform-agritech', { id: () => id, en: () => en });
