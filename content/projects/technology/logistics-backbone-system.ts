import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'logistics-backbone-system',
  category: 'technology',
  title: 'Logistics Operation Backbone System',
  subtitle: 'Dari spreadsheet ke sistem terintegrasi untuk ribuan pengiriman harian.',
  industry: 'Logistics & Ekspedisi',
  year: '2024',
  duration: '6 bulan',
  overview: 'Perusahaan ekspedisi ini memproses ribuan pengiriman setiap hari di puluhan rute berbeda. Seluruh operasional mereka berjalan di atas spreadsheet yang saling terhubung secara manual: order masuk dicatat di satu file, tracking status di file lain, invoice di file terpisah, dan rekonsiliasi dilakukan manual setiap minggu. Ketika volume pengiriman meningkat 3x lipat dalam setahun terakhir, sistem spreadsheet ini mulai runtuh. Data hilang, pengiriman tertukar, dan tim operasional menghabiskan lebih banyak waktu untuk administrasi daripada mengelola pengiriman.',
  sections: [
    {
      type: 'challenge-solution',
      challengeHeading: 'Tantangan Operasional',
      solutionHeading: 'Solusi yang Kami Bangun',
      challenges: [
        {
          title: 'Data tersebar di puluhan spreadsheet',
          description: 'Setiap departemen punya spreadsheet sendiri yang tidak sinkron satu sama lain. Satu perubahan status pengiriman harus di-update manual di 3-4 file berbeda. Human error menjadi hal sehari-hari.',
        },
        {
          title: 'Tidak ada visibilitas real-time',
          description: 'Manajemen tidak bisa melihat status operasional secara keseluruhan tanpa meminta update manual dari setiap tim. Pengambilan keputusan selalu tertunda karena data yang tersedia sudah tidak akurat.',
        },
        {
          title: 'Proses billing yang memakan waktu',
          description: 'Rekonsiliasi antara data pengiriman dan invoice dilakukan manual setiap akhir minggu. Prosesnya memakan 2-3 hari kerja, dan selalu ada selisih yang harus ditelusuri satu per satu.',
        },
        {
          title: 'Skalabilitas yang mentok',
          description: 'Spreadsheet yang sudah berisi ribuan baris mulai lambat dan sering corrupt. Tim terpaksa membagi data ke file-file baru setiap bulan, yang membuat pencarian historis menjadi mimpi buruk.',
        },
      ],
      solutions: [
        {
          title: 'Unified order management',
          description: 'Satu pintu masuk untuk semua order yang otomatis terdistribusi ke workflow yang sesuai. Setiap perubahan status ter-update secara real-time di seluruh sistem.',
        },
        {
          title: 'Live operations dashboard',
          description: 'Dashboard yang menampilkan seluruh operasional secara real-time: jumlah pengiriman aktif, status per rute, kapasitas armada, dan alert untuk anomali.',
        },
        {
          title: 'Automated billing engine',
          description: 'Sistem yang otomatis menghitung biaya berdasarkan parameter pengiriman dan menghasilkan invoice tanpa intervensi manual. Rekonsiliasi yang dulunya 3 hari sekarang instan.',
        },
        {
          title: 'Arsitektur yang scalable',
          description: 'Database yang dirancang untuk menangani pertumbuhan volume hingga 10x lipat tanpa degradasi performa, dengan history data yang mudah diakses dan di-query.',
        },
      ],
    },
    {
      type: 'metrics',
      heading: 'Dampak Setelah 3 Bulan Go-Live',
      items: [
        { value: '85%', label: 'Pengurangan waktu administrasi harian' },
        { value: '99.2%', label: 'Akurasi data pengiriman (dari 87%)' },
        { value: '0', label: 'Hari untuk rekonsiliasi billing (dari 3 hari)' },
        { value: '3x', label: 'Kapasitas volume tanpa tambah tim ops' },
      ],
    },
    {
      type: 'process-steps',
      heading: 'Pendekatan Pengembangan',
      steps: [
        {
          number: '01',
          title: 'Operations Mapping',
          description: 'Kami menghabiskan 2 minggu di lapangan, mengikuti alur kerja dari order masuk hingga pengiriman selesai. Kami memetakan setiap touchpoint, bottleneck, dan workaround yang sudah menjadi kebiasaan tim.',
        },
        {
          number: '02',
          title: 'Core System Architecture',
          description: 'Merancang arsitektur yang mengutamakan reliabilitas dan kecepatan. Sistem harus bisa diakses dari gudang, kantor, dan mobile device driver tanpa gangguan.',
        },
        {
          number: '03',
          title: 'Iterative Development',
          description: 'Pengembangan dilakukan dalam sprint 2-mingguan dengan demo ke tim operasional setiap akhir sprint. Feedback langsung dari pengguna akhir membentuk fitur yang benar-benar dibutuhkan.',
        },
        {
          number: '04',
          title: 'Parallel Running',
          description: 'Selama 1 bulan, sistem baru berjalan paralel dengan spreadsheet lama. Ini membangun kepercayaan tim dan memungkinkan kami menemukan edge case yang tidak terdeteksi saat development.',
        },
        {
          number: '05',
          title: 'Full Migration & Training',
          description: 'Migrasi data historis, pelatihan seluruh tim (dari admin hingga driver), dan pendampingan intensif selama 2 minggu pertama setelah cutover.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Teknologi terbaik bukan yang paling canggih, tapi yang membuat orang bisa fokus pada pekerjaan mereka yang sebenarnya.',
      attribution: 'Prinsip yang kami bawa dari hari pertama',
    },
    {
      type: 'text',
      heading: 'Kenapa Ini Bukan Sekadar "Digitalisasi Spreadsheet"',
      body: 'Banyak yang mengira solusinya sederhana: pindahkan spreadsheet ke database, beri interface web, selesai. Tapi realitanya jauh lebih kompleks.\n\nSpreadsheet bukan hanya alat pencatatan. Ia sudah menjadi bahasa komunikasi antar departemen. Setiap kolom, setiap warna sel, setiap formula tersembunyi mewakili aturan bisnis yang sudah berkembang selama bertahun-tahun. Membangun sistem baru berarti memahami dan menerjemahkan semua "pengetahuan tersembunyi" ini ke dalam logic yang terstruktur.\n\nItulah kenapa kami menghabiskan waktu yang signifikan di fase mapping. Bukan karena lambat, tapi karena kami tahu bahwa setiap aturan bisnis yang terlewat akan menjadi masalah yang jauh lebih mahal untuk diperbaiki setelah sistem berjalan.',
    },
  ],
  outcome: {
    heading: 'Operasional yang Akhirnya Bisa Bernapas',
    body: 'Tiga bulan setelah go-live, tim operasional yang dulunya tenggelam dalam pekerjaan administratif sekarang bisa fokus pada hal yang benar-benar penting: memastikan setiap pengiriman sampai tepat waktu. Manajemen punya visibilitas penuh untuk mengambil keputusan cepat. Dan yang paling signifikan, perusahaan ini sekarang siap untuk menangani pertumbuhan volume tanpa harus menambah tim operasional secara proporsional. Sistem ini bukan sekadar menggantikan spreadsheet. Ia mengubah cara perusahaan ini beroperasi.',
  },
  nextProject: { slug: 'integrated-dashboard-sales', title: 'Integrated Dashboard & Sales Management' },
};

const en: ProjectDetail = {
  slug: 'logistics-backbone-system',
  category: 'technology',
  title: 'Logistics Operation Backbone System',
  subtitle: 'From spreadsheets to an integrated system for thousands of daily deliveries.',
  industry: 'Logistics & Shipping',
  year: '2024',
  duration: '6 months',
  overview: 'This shipping company processed thousands of deliveries daily across dozens of different routes. Their entire operation ran on manually interconnected spreadsheets: incoming orders recorded in one file, tracking status in another, invoices in a separate file, and reconciliation done manually every week. When delivery volume tripled in the past year, this spreadsheet system started collapsing. Data went missing, shipments got mixed up, and the operations team spent more time on administration than managing deliveries.',
  sections: [
    {
      type: 'challenge-solution',
      challengeHeading: 'Operational Challenges',
      solutionHeading: 'The Solution We Built',
      challenges: [
        {
          title: 'Data scattered across dozens of spreadsheets',
          description: 'Each department had their own spreadsheets that were not synchronized. A single delivery status change had to be manually updated in 3-4 different files. Human error was a daily occurrence.',
        },
        {
          title: 'No real-time visibility',
          description: 'Management could not see overall operational status without requesting manual updates from each team. Decision-making was always delayed because available data was already inaccurate.',
        },
        {
          title: 'Time-consuming billing process',
          description: 'Reconciliation between delivery data and invoices was done manually every weekend. The process took 2-3 working days, and there were always discrepancies that had to be traced one by one.',
        },
        {
          title: 'Scalability ceiling',
          description: 'Spreadsheets containing thousands of rows became slow and frequently corrupted. The team was forced to split data into new files every month, making historical searches a nightmare.',
        },
      ],
      solutions: [
        {
          title: 'Unified order management',
          description: 'A single entry point for all orders that automatically distributes to the appropriate workflow. Every status change updates in real-time across the entire system.',
        },
        {
          title: 'Live operations dashboard',
          description: 'A dashboard displaying all operations in real-time: active delivery count, status per route, fleet capacity, and alerts for anomalies.',
        },
        {
          title: 'Automated billing engine',
          description: 'A system that automatically calculates costs based on delivery parameters and generates invoices without manual intervention. Reconciliation that used to take 3 days is now instant.',
        },
        {
          title: 'Scalable architecture',
          description: 'A database designed to handle volume growth up to 10x without performance degradation, with easily accessible and queryable historical data.',
        },
      ],
    },
    {
      type: 'metrics',
      heading: 'Impact After 3 Months Live',
      items: [
        { value: '85%', label: 'Reduction in daily admin time' },
        { value: '99.2%', label: 'Delivery data accuracy (from 87%)' },
        { value: '0', label: 'Days for billing reconciliation (from 3 days)' },
        { value: '3x', label: 'Volume capacity without adding ops team' },
      ],
    },
    {
      type: 'process-steps',
      heading: 'Development Approach',
      steps: [
        {
          number: '01',
          title: 'Operations Mapping',
          description: 'We spent 2 weeks in the field, following the workflow from order entry to delivery completion. We mapped every touchpoint, bottleneck, and workaround that had become team habits.',
        },
        {
          number: '02',
          title: 'Core System Architecture',
          description: 'Designing an architecture that prioritizes reliability and speed. The system had to be accessible from warehouses, offices, and driver mobile devices without disruption.',
        },
        {
          number: '03',
          title: 'Iterative Development',
          description: 'Development was done in 2-week sprints with demos to the operations team at the end of each sprint. Direct feedback from end users shaped features that were truly needed.',
        },
        {
          number: '04',
          title: 'Parallel Running',
          description: 'For 1 month, the new system ran parallel with the old spreadsheets. This built team confidence and allowed us to discover edge cases undetected during development.',
        },
        {
          number: '05',
          title: 'Full Migration & Training',
          description: 'Historical data migration, training for all team members (from admin to drivers), and intensive support during the first 2 weeks after cutover.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'The best technology is not the most sophisticated, but the one that lets people focus on their actual work.',
      attribution: 'The principle we carried from day one',
    },
    {
      type: 'text',
      heading: 'Why This Is Not Just "Digitizing Spreadsheets"',
      body: 'Many assume the solution is simple: move the spreadsheet to a database, add a web interface, done. But reality is far more complex.\n\nSpreadsheets are not just recording tools. They have become the communication language between departments. Every column, every cell color, every hidden formula represents business rules that have evolved over years. Building a new system means understanding and translating all this "hidden knowledge" into structured logic.\n\nThat is why we spent significant time in the mapping phase. Not because we were slow, but because we know that every missed business rule becomes a far more expensive problem to fix once the system is live.',
    },
  ],
  outcome: {
    heading: 'Operations That Can Finally Breathe',
    body: 'Three months after go-live, the operations team that used to be drowning in administrative work can now focus on what truly matters: ensuring every delivery arrives on time. Management has full visibility for quick decision-making. And most significantly, this company is now ready to handle volume growth without proportionally expanding the operations team. This system did not just replace spreadsheets. It changed how this company operates.',
  },
  nextProject: { slug: 'integrated-dashboard-sales', title: 'Integrated Dashboard & Sales Management' },
};

registerProject('logistics-backbone-system', { id: () => id, en: () => en });
