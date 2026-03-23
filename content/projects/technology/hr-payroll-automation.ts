import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'hr-payroll-automation',
  category: 'technology',
  title: 'HR & Payroll Automation Platform',
  subtitle: 'Otomasi HR dan payroll untuk skema kompensasi yang kompleks.',
  industry: 'Professional Services',
  year: '2023',
  duration: '5 bulan',
  overview: 'Perusahaan jasa profesional ini memiliki lebih dari 300 karyawan dengan campuran status: karyawan tetap, kontrak, freelance, dan project-based. Setiap kategori punya skema kompensasi, benefit, dan aturan pajak yang berbeda. Tim HR mereka menghabiskan minggu pertama setiap bulan hanya untuk menghitung payroll secara manual di spreadsheet. Kesalahan hitung terjadi hampir setiap bulan, menimbulkan ketidakpuasan karyawan dan risiko compliance. Kami membangun platform yang mengotomasi seluruh proses, dari pencatatan kehadiran hingga slip gaji.',
  sections: [
    {
      type: 'two-column',
      left: {
        heading: 'Realita HR di Perusahaan Berkembang',
        body: 'Saat perusahaan masih kecil, mengelola payroll di spreadsheet masih bisa ditoleransi. Tapi begitu jumlah karyawan melampaui 100 orang dengan berbagai skema kerja, kompleksitasnya meledak secara eksponensial. Bukan hanya soal menghitung gaji pokok. Ada tunjangan yang berbeda per level, potongan BPJS dengan basis kalkulasi yang berubah, PPh 21 dengan tarif progresif, lembur dengan aturan berbeda untuk setiap kategori karyawan, dan bonus yang dihitung berdasarkan formula yang berbeda setiap kuartal.',
      },
      right: {
        heading: 'Kenapa Solusi Off-the-Shelf Tidak Cocok',
        body: 'Tim HR sudah mencoba dua platform payroll SaaS sebelumnya. Keduanya gagal karena alasan yang sama: tidak bisa mengakomodasi skema kompensasi yang unik. Platform SaaS dirancang untuk "kasus umum" dan menawarkan customization terbatas. Ketika ada aturan bisnis yang tidak standar, pilihan biasanya hanya dua: ubah proses bisnis Anda atau hitung manual di luar sistem. Keduanya bukan solusi yang bisa diterima.',
      },
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Kompleksitas Payroll',
      solutionHeading: 'Platform yang Kami Bangun',
      challenges: [
        {
          title: '4 skema kompensasi berbeda',
          description: 'Karyawan tetap, kontrak, freelance, dan project-based masing-masing punya struktur gaji, tunjangan, dan benefit yang berbeda. Satu formula payroll tidak cukup.',
        },
        {
          title: 'Aturan pajak yang dinamis',
          description: 'PPh 21 dengan tarif progresif, BPJS dengan ceiling yang berubah setiap tahun, dan berbagai potongan voluntary yang berbeda per karyawan. Satu kesalahan hitung bisa berimplikasi legal.',
        },
        {
          title: 'Approval workflow yang berlapis',
          description: 'Lembur, cuti, reimburse, dan perubahan data karyawan memerlukan approval dari multiple pihak. Prosesnya sering macet karena bottleneck di satu approver.',
        },
        {
          title: 'Reporting untuk berbagai kebutuhan',
          description: 'Manajemen butuh report performa HR, finance butuh report cost per department, dan compliance butuh report pajak. Semua format berbeda dan sebelumnya dibuat manual.',
        },
      ],
      solutions: [
        {
          title: 'Configurable compensation engine',
          description: 'Rules engine yang memungkinkan HR mendefinisikan formula kompensasi per kategori karyawan tanpa bantuan developer. Perubahan aturan bisa diaplikasikan langsung.',
        },
        {
          title: 'Auto-calculated tax & statutory',
          description: 'Kalkulasi PPh 21, BPJS Kesehatan, BPJS Ketenagakerjaan, dan potongan lainnya yang otomatis mengikuti regulasi terbaru. Update regulasi cukup di satu tempat.',
        },
        {
          title: 'Flexible approval routing',
          description: 'Approval workflow yang bisa dikonfigurasi per jenis request, dengan eskalasi otomatis jika approver tidak merespons dalam waktu yang ditentukan.',
        },
        {
          title: 'One-click reporting',
          description: 'Report generator yang menghasilkan laporan dalam format yang dibutuhkan oleh masing-masing stakeholder. Dari slip gaji karyawan hingga SPT tahunan.',
        },
      ],
    },
    {
      type: 'gallery-text',
      heading: 'Modul Platform',
      body: 'Platform ini dirancang sebagai ekosistem HR terpadu yang menghubungkan seluruh siklus employee lifecycle.',
      items: [
        {
          label: 'Employee Database',
          description: 'Single source of truth untuk semua data karyawan. Riwayat perubahan jabatan, gaji, dan status tersimpan lengkap untuk audit trail.',
        },
        {
          label: 'Attendance & Leave',
          description: 'Integrasi dengan mesin fingerprint dan mobile check-in. Kalkulasi lembur otomatis dengan aturan yang berbeda per kategori karyawan.',
        },
        {
          label: 'Payroll Processing',
          description: 'Proses payroll yang dulunya 5 hari sekarang selesai dalam hitungan menit. Termasuk simulasi "what-if" sebelum finalisasi untuk verifikasi.',
        },
        {
          label: 'Employee Self-Service',
          description: 'Portal dimana karyawan bisa melihat slip gaji, mengajukan cuti, submit reimburse, dan update data pribadi tanpa harus menghubungi HR.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Payroll bukan sekadar menghitung angka. Payroll adalah janji perusahaan kepada setiap karyawannya, dan janji itu harus ditepati dengan presisi setiap bulan.',
      attribution: 'Perspektif yang membentuk desain platform',
    },
    {
      type: 'metrics',
      heading: 'Hasil Implementasi',
      items: [
        { value: '95%', label: 'Pengurangan waktu proses payroll' },
        { value: '0', label: 'Kesalahan hitung sejak go-live' },
        { value: '100%', label: 'Compliance pajak dan statutory' },
        { value: '70%', label: 'Pengurangan beban administrasi HR' },
      ],
    },
    {
      type: 'text',
      heading: 'Dampak yang Melampaui Efisiensi',
      body: 'Efisiensi operasional adalah manfaat yang langsung terasa. Tapi dampak yang lebih dalam terjadi pada kepercayaan karyawan. Ketika gaji selalu tepat waktu dan tepat jumlah, ketika slip gaji transparan dan bisa diakses kapan saja, dan ketika pengajuan cuti atau reimburse diproses dengan cepat, karyawan merasa dihargai.\n\nTim HR yang dulunya "terjebak" di pekerjaan administratif sekarang punya bandwidth untuk fokus pada hal-hal strategis: talent development, employee engagement, dan organizational culture. Itulah peran HR yang sebenarnya.',
    },
  ],
  outcome: {
    heading: 'HR yang Bisa Fokus pada Manusia, Bukan Spreadsheet',
    body: 'Setelah 6 bulan berjalan, platform ini memproses payroll untuk 300+ karyawan tanpa satu pun kesalahan hitung. Tim HR yang dulunya terdiri dari 5 orang untuk administrasi sekarang cukup 2 orang, sementara 3 orang lainnya dialihkan ke peran strategic HR. Karyawan memberikan rating 4.8 dari 5 untuk kepuasan terhadap proses HR, naik dari 3.1 sebelumnya. Platform ini membuktikan bahwa investasi di sistem HR bukan hanya soal efisiensi, tapi soal membangun organisasi yang lebih sehat.',
  },
  nextProject: { slug: 'customer-portal-ticketing-isp', title: 'Customer Portal & Ticketing System' },
};

const en: ProjectDetail = {
  slug: 'hr-payroll-automation',
  category: 'technology',
  title: 'HR & Payroll Automation Platform',
  subtitle: 'HR and payroll automation for complex compensation schemes.',
  industry: 'Professional Services',
  year: '2023',
  duration: '5 months',
  overview: 'This professional services firm had over 300 employees with a mix of statuses: permanent, contract, freelance, and project-based. Each category had different compensation schemes, benefits, and tax rules. Their HR team spent the first week of every month just calculating payroll manually in spreadsheets. Calculation errors occurred almost every month, causing employee dissatisfaction and compliance risks. We built a platform that automates the entire process, from attendance tracking to payslip generation.',
  sections: [
    {
      type: 'two-column',
      left: {
        heading: 'The Reality of HR in a Growing Company',
        body: 'When a company is still small, managing payroll in spreadsheets is tolerable. But once headcount exceeds 100 people with various work schemes, complexity explodes exponentially. It is not just about calculating base salary. There are allowances that differ by level, social security deductions with changing calculation bases, progressive income tax rates, overtime with different rules for each employee category, and bonuses calculated with formulas that change every quarter.',
      },
      right: {
        heading: 'Why Off-the-Shelf Solutions Did Not Fit',
        body: 'The HR team had already tried two SaaS payroll platforms before. Both failed for the same reason: they could not accommodate unique compensation schemes. SaaS platforms are designed for "common cases" and offer limited customization. When there are non-standard business rules, the choice is usually only two: change your business process or calculate manually outside the system. Neither was an acceptable solution.',
      },
    },
    {
      type: 'challenge-solution',
      challengeHeading: 'Payroll Complexity',
      solutionHeading: 'The Platform We Built',
      challenges: [
        {
          title: '4 different compensation schemes',
          description: 'Permanent, contract, freelance, and project-based employees each had different salary structures, allowances, and benefits. One payroll formula was not enough.',
        },
        {
          title: 'Dynamic tax regulations',
          description: 'Progressive income tax, social security with annually changing ceilings, and various voluntary deductions differing per employee. A single miscalculation could have legal implications.',
        },
        {
          title: 'Multi-layered approval workflows',
          description: 'Overtime, leave, reimbursements, and employee data changes required approval from multiple parties. The process often stalled due to bottlenecks at one approver.',
        },
        {
          title: 'Reporting for various stakeholders',
          description: 'Management needed HR performance reports, finance needed cost-per-department reports, and compliance needed tax reports. All in different formats, all previously made manually.',
        },
      ],
      solutions: [
        {
          title: 'Configurable compensation engine',
          description: 'A rules engine that lets HR define compensation formulas per employee category without developer help. Rule changes can be applied immediately.',
        },
        {
          title: 'Auto-calculated tax & statutory',
          description: 'Automatic calculation of income tax, health insurance, employment insurance, and other deductions following the latest regulations. Regulation updates are made in one place.',
        },
        {
          title: 'Flexible approval routing',
          description: 'Approval workflows configurable per request type, with automatic escalation if an approver does not respond within the set timeframe.',
        },
        {
          title: 'One-click reporting',
          description: 'A report generator that produces reports in the format required by each stakeholder. From employee payslips to annual tax returns.',
        },
      ],
    },
    {
      type: 'gallery-text',
      heading: 'Platform Modules',
      body: 'This platform was designed as an integrated HR ecosystem connecting the entire employee lifecycle.',
      items: [
        {
          label: 'Employee Database',
          description: 'Single source of truth for all employee data. Complete history of position changes, salary adjustments, and status changes for audit trails.',
        },
        {
          label: 'Attendance & Leave',
          description: 'Integration with fingerprint machines and mobile check-in. Automatic overtime calculation with different rules per employee category.',
        },
        {
          label: 'Payroll Processing',
          description: 'The payroll process that used to take 5 days now completes in minutes. Includes "what-if" simulation before finalization for verification.',
        },
        {
          label: 'Employee Self-Service',
          description: 'A portal where employees can view payslips, apply for leave, submit reimbursements, and update personal data without contacting HR.',
        },
      ],
    },
    {
      type: 'quote',
      text: 'Payroll is not just about calculating numbers. Payroll is the company\'s promise to every employee, and that promise must be kept with precision every month.',
      attribution: 'The perspective that shaped the platform design',
    },
    {
      type: 'metrics',
      heading: 'Implementation Results',
      items: [
        { value: '95%', label: 'Reduction in payroll processing time' },
        { value: '0', label: 'Calculation errors since go-live' },
        { value: '100%', label: 'Tax and statutory compliance' },
        { value: '70%', label: 'Reduction in HR admin workload' },
      ],
    },
    {
      type: 'text',
      heading: 'Impact Beyond Efficiency',
      body: 'Operational efficiency is the benefit that is immediately felt. But the deeper impact happens in employee trust. When salaries are always on time and accurate, when payslips are transparent and accessible anytime, and when leave or reimbursement requests are processed quickly, employees feel valued.\n\nThe HR team that was previously "trapped" in administrative work now has bandwidth to focus on strategic matters: talent development, employee engagement, and organizational culture. That is the true role of HR.',
    },
  ],
  outcome: {
    heading: 'HR That Can Focus on People, Not Spreadsheets',
    body: 'After 6 months of operation, this platform processes payroll for 300+ employees without a single calculation error. The HR team that previously consisted of 5 people for administration now needs only 2, while the other 3 were reassigned to strategic HR roles. Employees gave a satisfaction rating of 4.8 out of 5 for HR processes, up from 3.1 before. This platform proves that investing in HR systems is not just about efficiency, but about building a healthier organization.',
  },
  nextProject: { slug: 'customer-portal-ticketing-isp', title: 'Customer Portal & Ticketing System' },
};

registerProject('hr-payroll-automation', { id: () => id, en: () => en });
