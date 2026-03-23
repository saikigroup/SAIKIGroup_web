import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'customer-portal-ticketing-isp',
  category: 'technology',
  title: 'Customer Portal & Ticketing System',
  subtitle: 'Mengubah cara ISP regional melayani pelanggan mereka.',
  industry: 'Telekomunikasi & ISP',
  year: '2025',
  duration: '4 bulan',
  overview: 'ISP regional dengan ribuan pelanggan di beberapa kabupaten mengalami lonjakan komplain yang tidak bisa mereka tangani secara efektif. Pelanggan menelepon berulang kali tanpa kejelasan status penanganan. Teknisi di lapangan tidak tahu prioritas mana yang harus dikerjakan duluan. Tim customer service kewalahan menjawab pertanyaan yang sama berulang-ulang: "Kapan internet saya diperbaiki?" Kami membangun customer portal dan ticketing system yang memberikan transparansi kepada pelanggan dan struktur kepada tim internal.',
  sections: [
    {
      type: 'highlight',
      heading: 'Bukan Masalah Teknologi, Tapi Masalah Komunikasi',
      body: 'Saat pertama kali berdiskusi, tim manajemen ISP ini yakin bahwa masalah utama mereka adalah kurangnya teknisi. Tapi setelah kami menganalisis data komplain lebih dalam, kami menemukan fakta yang mengejutkan: 60% telepon masuk ke customer service bukan untuk melaporkan masalah baru. Mereka menelepon untuk menanyakan status tiket yang sudah dilaporkan sebelumnya. Pelanggan tidak tahu apakah laporannya sudah diterima, sedang dikerjakan, atau terlupakan. Ketidakpastian ini yang menciptakan frustrasi dan memenuhi jalur komunikasi.',
    },
    {
      type: 'process-steps',
      heading: 'Dari Keluhan ke Solusi Terstruktur',
      steps: [
        {
          number: '01',
          title: 'Customer Journey Mapping',
          description: 'Kami memetakan seluruh perjalanan pelanggan dari saat mengalami gangguan hingga masalah terselesaikan. Setiap titik frustrasi diidentifikasi: waktu tunggu telepon, ketidakjelasan status, dan janji perbaikan yang tidak tepat.',
        },
        {
          number: '02',
          title: 'Internal Workflow Redesign',
          description: 'Sebelum membangun teknologi, kami merestrukturisasi workflow penanganan tiket. Definisi prioritas yang jelas, SLA per kategori masalah, dan eskalasi otomatis untuk tiket yang melewati batas waktu.',
        },
        {
          number: '03',
          title: 'Portal & System Development',
          description: 'Pengembangan paralel customer portal (untuk pelanggan) dan internal ticketing system (untuk tim CS dan teknisi). Keduanya terhubung secara real-time.',
        },
        {
          number: '04',
          title: 'Field Technician App',
          description: 'Aplikasi mobile untuk teknisi yang menampilkan tiket berdasarkan prioritas dan lokasi. Teknisi bisa update status langsung dari lapangan, yang otomatis ter-reflect di portal pelanggan.',
        },
        {
          number: '05',
          title: 'Soft Launch & Iteration',
          description: 'Peluncuran bertahap dimulai dari satu area coverage untuk mengumpulkan feedback real dari pelanggan dan tim sebelum rollout penuh.',
        },
      ],
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Pain Points Pelanggan',
      solutionHeading: 'Fitur yang Menjawab',
      challenges: [
        {
          title: 'Tidak tahu status laporan',
          description: 'Setelah menelepon CS, pelanggan tidak punya cara untuk mengecek apakah laporannya sudah ditindaklanjuti. Satu-satunya opsi adalah menelepon lagi.',
        },
        {
          title: 'Waktu tunggu telepon yang lama',
          description: 'Dengan hanya 3 agent CS untuk ribuan pelanggan, waktu tunggu bisa mencapai 15-20 menit. Banyak pelanggan menyerah dan langsung posting keluhan di media sosial.',
        },
        {
          title: 'Janji waktu yang tidak bisa dipegang',
          description: 'Teknisi sering memberikan estimasi waktu perbaikan yang tidak realistis karena tidak tahu beban kerja yang sebenarnya. Pelanggan kecewa karena ekspektasi yang tidak terpenuhi.',
        },
      ],
      solutions: [
        {
          title: 'Real-time ticket tracking',
          description: 'Pelanggan bisa melihat status tiketnya kapan saja melalui portal: diterima, sedang ditangani, teknisi dalam perjalanan, atau sudah selesai. Lengkap dengan notifikasi di setiap perubahan status.',
        },
        {
          title: 'Self-service troubleshooting',
          description: 'Panduan troubleshooting interaktif untuk masalah umum. Pelanggan bisa mencoba solusi sederhana sebelum membuat tiket, mengurangi beban CS untuk masalah yang bisa diselesaikan sendiri.',
        },
        {
          title: 'Honest ETA system',
          description: 'Estimasi waktu perbaikan yang dihitung berdasarkan beban kerja teknisi aktual dan lokasi. Lebih baik memberikan estimasi yang realistis daripada janji yang tidak bisa ditepati.',
        },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'Pelanggan tidak marah karena ada gangguan. Pelanggan marah karena tidak tahu kapan gangguannya selesai.',
    },
    {
      type: 'two-column',
      left: {
        heading: 'Untuk Pelanggan',
        body: 'Portal yang bisa diakses via browser atau WhatsApp bot. Pelanggan bisa membuat tiket, melacak status, melihat riwayat gangguan, dan bahkan melihat jadwal maintenance yang direncanakan. Notifikasi proaktif dikirim saat ada perubahan status atau maintenance terjadwal di area mereka. Pengalaman yang dulunya penuh frustrasi sekarang menjadi transparan dan bisa diprediksi.',
      },
      right: {
        heading: 'Untuk Tim Internal',
        body: 'Dashboard operasional yang menampilkan seluruh tiket berdasarkan prioritas, SLA status, dan distribusi per area. Manager bisa melihat bottleneck secara real-time dan mengalokasikan resource dengan lebih baik. Report otomatis untuk analisis tren masalah, sehingga tim bisa melakukan preventive maintenance sebelum masalah terjadi di banyak pelanggan.',
      },
    },
    {
      type: 'metrics',
      heading: 'Perubahan dalam 2 Bulan Pertama',
      items: [
        { value: '73%', label: 'Pengurangan telepon ke CS' },
        { value: '45%', label: 'Pengurangan waktu resolusi rata-rata' },
        { value: '4.5', label: 'Rating kepuasan pelanggan (dari 2.8)' },
        { value: '30%', label: 'Masalah terselesaikan via self-service' },
      ],
    },
  ],
  outcome: {
    heading: 'Dari Reaktif ke Proaktif',
    body: 'Transformasi paling signifikan bukan di angka-angkanya, tapi di perubahan mindset. ISP ini bergeser dari operasi yang reaktif (menunggu komplain) ke proaktif (mendeteksi dan menangani masalah sebelum pelanggan melaporkan). Dengan data dari ticketing system, mereka bisa mengidentifikasi pola masalah di area tertentu dan melakukan tindakan preventif. Pelanggan yang dulunya vokal di media sosial sekarang menjadi pemberi testimoni positif karena merasa didengar dan dilayani dengan transparan. Churn rate turun signifikan di kuartal pertama setelah launch.',
  },
  nextProject: { slug: 'data-analytics-platform-agritech', title: 'Data Analytics Platform untuk Agritech' },
};

const en: ProjectDetail = {
  slug: 'customer-portal-ticketing-isp',
  category: 'technology',
  title: 'Customer Portal & Ticketing System',
  subtitle: 'Changing how a regional ISP serves their customers.',
  industry: 'Telecommunications & ISP',
  year: '2025',
  duration: '4 months',
  overview: 'A regional ISP with thousands of subscribers across several districts experienced a surge in complaints they could not handle effectively. Customers called repeatedly without clarity on resolution status. Field technicians did not know which priorities to address first. The customer service team was overwhelmed answering the same questions over and over: "When will my internet be fixed?" We built a customer portal and ticketing system that brings transparency to customers and structure to the internal team.',
  sections: [
    {
      type: 'highlight',
      heading: 'Not a Technology Problem, But a Communication Problem',
      body: 'During our initial discussion, the ISP management team was convinced their main problem was a shortage of technicians. But after we analyzed complaint data more deeply, we found a surprising fact: 60% of incoming calls to customer service were not to report new issues. They were calling to ask about the status of previously reported tickets. Customers had no way of knowing whether their report was received, being worked on, or forgotten. This uncertainty created frustration and flooded communication lines.',
    },
    {
      type: 'process-steps',
      heading: 'From Complaints to a Structured Solution',
      steps: [
        {
          number: '01',
          title: 'Customer Journey Mapping',
          description: 'We mapped the entire customer journey from experiencing a disruption to resolution. Every frustration point was identified: phone wait times, status uncertainty, and repair promises that were not kept.',
        },
        {
          number: '02',
          title: 'Internal Workflow Redesign',
          description: 'Before building technology, we restructured the ticket handling workflow. Clear priority definitions, SLA per issue category, and automatic escalation for tickets exceeding time limits.',
        },
        {
          number: '03',
          title: 'Portal & System Development',
          description: 'Parallel development of the customer portal (for customers) and internal ticketing system (for CS and technicians). Both connected in real-time.',
        },
        {
          number: '04',
          title: 'Field Technician App',
          description: 'A mobile app for technicians showing tickets by priority and location. Technicians can update status directly from the field, automatically reflected in the customer portal.',
        },
        {
          number: '05',
          title: 'Soft Launch & Iteration',
          description: 'Gradual launch starting from one coverage area to collect real feedback from customers and the team before full rollout.',
        },
      ],
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Customer Pain Points',
      solutionHeading: 'Features That Address Them',
      challenges: [
        {
          title: 'No visibility on report status',
          description: 'After calling CS, customers had no way to check if their report was being acted on. The only option was to call again.',
        },
        {
          title: 'Long phone wait times',
          description: 'With only 3 CS agents for thousands of subscribers, wait times could reach 15-20 minutes. Many customers gave up and posted complaints on social media instead.',
        },
        {
          title: 'Unreliable time estimates',
          description: 'Technicians often gave unrealistic repair time estimates because they did not know their actual workload. Customers were disappointed by unmet expectations.',
        },
      ],
      solutions: [
        {
          title: 'Real-time ticket tracking',
          description: 'Customers can view their ticket status anytime through the portal: received, being handled, technician en route, or resolved. Complete with notifications at every status change.',
        },
        {
          title: 'Self-service troubleshooting',
          description: 'Interactive troubleshooting guides for common issues. Customers can try simple solutions before creating a ticket, reducing CS load for self-resolvable issues.',
        },
        {
          title: 'Honest ETA system',
          description: 'Repair time estimates calculated based on actual technician workload and location. Better to give realistic estimates than promises that cannot be kept.',
        },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'Customers are not angry because there is a disruption. Customers are angry because they do not know when the disruption will end.',
    },
    {
      type: 'two-column',
      left: {
        heading: 'For Customers',
        body: 'A portal accessible via browser or WhatsApp bot. Customers can create tickets, track status, view disruption history, and even see planned maintenance schedules. Proactive notifications are sent when status changes or scheduled maintenance occurs in their area. An experience that was once full of frustration is now transparent and predictable.',
      },
      right: {
        heading: 'For the Internal Team',
        body: 'An operational dashboard displaying all tickets by priority, SLA status, and distribution per area. Managers can see bottlenecks in real-time and allocate resources more effectively. Automatic reports for issue trend analysis, enabling the team to perform preventive maintenance before problems affect many customers.',
      },
    },
    {
      type: 'metrics',
      heading: 'Changes in the First 2 Months',
      items: [
        { value: '73%', label: 'Reduction in calls to CS' },
        { value: '45%', label: 'Reduction in average resolution time' },
        { value: '4.5', label: 'Customer satisfaction rating (from 2.8)' },
        { value: '30%', label: 'Issues resolved via self-service' },
      ],
    },
  ],
  outcome: {
    heading: 'From Reactive to Proactive',
    body: 'The most significant transformation was not in the numbers, but in the mindset shift. This ISP moved from reactive operations (waiting for complaints) to proactive (detecting and addressing issues before customers report them). With data from the ticketing system, they can identify problem patterns in specific areas and take preventive action. Customers who were previously vocal on social media are now providing positive testimonials because they feel heard and served transparently. Churn rate dropped significantly in the first quarter after launch.',
  },
  nextProject: { slug: 'data-analytics-platform-agritech', title: 'Data Analytics Platform for Agritech' },
};

registerProject('customer-portal-ticketing-isp', { id: () => id, en: () => en });
