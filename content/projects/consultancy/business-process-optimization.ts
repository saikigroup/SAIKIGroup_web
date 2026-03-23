import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'business-process-optimization',
  category: 'consultancy',
  title: 'Puluhan Profesional, Satu Pendekatan Personal',
  subtitle: 'Kompilasi cerita dari berbagai profesional yang sudah kami dampingi dalam menavigasi karier mereka.',
  industry: 'Career & Professional Development',
  year: '2024-2025',
  duration: 'Berkelanjutan',
  overview: 'SAIKI Consultancy tidak bekerja dengan perusahaan. Kami bekerja dengan manusia. Setiap orang yang datang ke kami membawa cerita, keresahan, dan harapan yang berbeda. Ada yang merasa stuck setelah bertahun-tahun di posisi yang sama. Ada yang baru lulus dan tidak tahu harus mulai dari mana. Ada yang ingin pindah industri tapi takut kehilangan apa yang sudah dibangun. Halaman ini adalah kompilasi dari berbagai kasus yang sudah kami tangani dan selesaikan, diceritakan secara anonim untuk menghormati privasi setiap individu.',
  sections: [
    {
      type: 'text',
      heading: 'Kenapa Kami Mengkompilasi Cerita Ini',
      body: 'Setiap kali seseorang mempertimbangkan untuk berkonsultasi soal karier, pertanyaan pertama yang muncul biasanya: "Apakah orang lain juga mengalami hal yang sama?" Jawabannya hampir selalu ya. Tantangan karier yang terasa sangat personal sebenarnya sering kali mengikuti pola yang bisa dipetakan.\n\nKami mengumpulkan cerita-cerita ini bukan untuk memamerkan jumlah klien, tapi agar Anda yang sedang membaca bisa melihat diri sendiri di salah satu cerita ini dan tahu bahwa ada jalan keluar yang sudah terbukti berhasil.',
    },
    {
      type: 'full-width-statement',
      statement: 'Setiap orang yang datang ke kami bukan karena tidak mampu. Mereka datang karena butuh perspektif baru dari seseorang yang sudah melihat ratusan pola karier yang serupa.',
    },
    {
      type: 'gallery-text',
      heading: 'Pola Kasus yang Sering Kami Temui',
      body: 'Dari puluhan profesional yang sudah kami dampingi, ada beberapa pola tantangan yang konsisten muncul, terlepas dari industri atau level jabatan mereka.',
      items: [
        {
          label: '"Saya stuck tapi tidak tahu kenapa"',
          description: 'Profesional dengan pengalaman 5-10 tahun yang merasa kariernya jalan di tempat. Performanya baik, tapi tidak ada perkembangan. Setelah kami gali, biasanya masalahnya bukan kompetensi tapi visibility dan positioning di organisasi.',
        },
        {
          label: '"Saya mau pindah tapi takut mulai dari nol"',
          description: 'Career changer yang ingin berpindah industri atau fungsi. Ketakutan terbesar mereka: kehilangan seniority dan harus memulai dari bawah lagi. Padahal, banyak skill yang transferable jika di-frame dengan tepat.',
        },
        {
          label: '"Saya baru lulus dan bingung mau ke mana"',
          description: 'Fresh graduate yang overwhelmed dengan pilihan. Tekanan dari keluarga, teman sebaya, dan media sosial membuat mereka sulit mendengarkan suara mereka sendiri. Kami bantu mereka memfilter noise dan menemukan arah yang genuinely cocok.',
        },
        {
          label: '"Saya ingin naik level tapi selalu kelewatan"',
          description: 'Middle manager yang sudah siap untuk promosi tapi selalu "hampir dapat". Biasanya ada gap antara persepsi mereka tentang diri sendiri dan persepsi decision maker. Kami bantu menjembatani gap itu.',
        },
        {
          label: '"Saya tidak yakin dengan personal brand saya"',
          description: 'Profesional yang tahu bahwa di era digital, kehadiran online penting, tapi tidak tahu harus menampilkan diri sebagai apa. LinkedIn mereka kosong atau generik. Kami bantu membangun narasi profesional yang autentik.',
        },
      ],
    },
    {
      type: 'highlight',
      heading: 'Pendekatan Kami: Bukan Coaching Generik',
      body: 'Kami tidak menggunakan framework one-size-fits-all. Setiap sesi dimulai dengan mendengarkan. Kami percaya bahwa jawaban untuk tantangan karier seseorang biasanya sudah ada di dalam diri mereka sendiri, hanya perlu digali dan distrukturkan. Peran kami adalah menjadi cermin yang jujur, peta yang akurat, dan pendorong yang sabar. Kami memberikan langkah konkret yang bisa dieksekusi minggu ini, bukan inspirasi abstrak yang menguap besok.',
    },
    {
      type: 'process-steps',
      heading: 'Bagaimana Sesi Kami Berjalan',
      steps: [
        {
          number: '01',
          title: 'Percakapan Awal (Gratis)',
          description: 'Obrolan santai 30 menit untuk memahami situasi dan melihat apakah kami bisa membantu. Tidak ada komitmen, tidak ada tekanan. Kadang, percakapan awal ini saja sudah memberikan clarity yang dibutuhkan.',
        },
        {
          number: '02',
          title: 'Assessment & Mapping',
          description: 'Jika lanjut, kami melakukan assessment mendalam: kekuatan, pengalaman, minat, nilai hidup, dan kondisi pasar. Hasilnya adalah peta situasi yang jujur, bukan sugarcoating.',
        },
        {
          number: '03',
          title: 'Strategy & Action Plan',
          description: 'Dari peta situasi, kami menyusun strategi dan action plan yang spesifik. Bukan "tingkatkan networking" tapi "hubungi 3 orang ini minggu depan dengan pesan seperti ini."',
        },
        {
          number: '04',
          title: 'Eksekusi & Pendampingan',
          description: 'Selama beberapa minggu, kami mendampingi eksekusi: review CV, latihan interview, feedback pada konten LinkedIn, atau strategi negosiasi. Kami ada di setiap langkah kritis.',
        },
        {
          number: '05',
          title: 'Review & Kalibrasi',
          description: 'Setelah milestone tertentu tercapai, kami review hasilnya dan kalibrasi strategi jika perlu. Karier adalah perjalanan panjang, dan kami pastikan fondasinya kuat.',
        },
      ],
    },
    {
      type: 'two-column',
      left: {
        heading: 'Cerita A: Dari 7 Tahun Stuck ke Promosi dalam 4 Bulan',
        body: 'Seorang profesional di industri perbankan merasa kariernya stagnan selama 7 tahun. Performanya selalu "memenuhi ekspektasi" tapi tidak pernah menonjol. Setelah assessment, kami menemukan bahwa masalahnya bukan di kompetensi tapi di cara ia memposisikan kontribusinya. Ia mengerjakan banyak hal penting tapi tidak pernah memastikan decision maker tahu. Dalam 4 bulan setelah menerapkan strategi visibility yang kami susun, ia mendapatkan promosi yang sudah ia tunggu bertahun-tahun.',
      },
      right: {
        heading: 'Cerita B: Career Switch dari Finance ke Tech tanpa Mulai dari Nol',
        body: 'Seorang finance manager ingin pindah ke industri teknologi tapi takut harus mulai dari posisi junior. Kami membantu ia memetakan skill yang transferable: analytical thinking, stakeholder management, dan pemahaman bisnis. Kami reframe pengalaman finance-nya bukan sebagai "background yang salah" tapi sebagai "perspektif unik yang langka di tech". Dalam 3 bulan, ia diterima sebagai business operations manager di perusahaan tech, di level yang setara dengan posisi sebelumnya.',
      },
    },
    {
      type: 'two-column',
      left: {
        heading: 'Cerita C: Fresh Graduate yang Menemukan Arahnya',
        body: 'Seorang lulusan baru dari jurusan komunikasi merasa bingung. Keluarganya menyarankan jadi PNS, temannya pada kerja di agency, dan media sosial bilang harus jadi entrepreneur. Setelah sesi assessment, kami menemukan bahwa minat dan kekuatannya paling cocok untuk peran di corporate communications. Kami bantu menyusun CV yang fokus, latihan interview, dan strategi aplikasi yang targeted. Dalam 2 bulan, ia mendapatkan posisi di perusahaan yang ia tidak pernah bayangkan bisa ia masuki.',
      },
      right: {
        heading: 'Cerita D: Membangun Personal Brand dari Nol',
        body: 'Seorang konsultan independen punya keahlian yang luar biasa tapi tidak punya presence online sama sekali. Klien barunya selalu datang dari referral, dan ia ingin memperluas jangkauan. Kami bantu membangun narasi profesional, mengoptimasi profil LinkedIn, dan menyusun strategi konten mingguan yang bisa ia jalankan sendiri. Dalam 6 bulan, follower LinkedIn-nya tumbuh organik dan ia mulai mendapatkan inbound leads dari orang yang belum pernah ia kenal sebelumnya.',
      },
    },
    {
      type: 'metrics',
      heading: 'Akumulasi Dampak',
      items: [
        { value: '30+', label: 'Profesional yang sudah kami dampingi' },
        { value: '85%', label: 'Mencapai target karier dalam 6 bulan' },
        { value: '100%', label: 'Merasa lebih jelas tentang arah karier' },
        { value: '4.9', label: 'Rating kepuasan rata-rata (dari 5)' },
      ],
    },
    {
      type: 'quote',
      text: 'Saya datang dengan satu pertanyaan: harus ngapain? Saya pulang bukan cuma dengan jawaban, tapi dengan peta lengkap dan langkah pertama yang sudah jelas.',
      attribution: 'Salah satu profesional yang kami dampingi',
    },
  ],
  outcome: {
    heading: 'Bukan Sekadar Konsultasi, Tapi Titik Balik',
    body: 'Dari semua profesional yang sudah kami dampingi, pola yang paling konsisten bukan tentang "mendapatkan pekerjaan baru" atau "naik gaji". Pola yang paling konsisten adalah perubahan cara pandang terhadap karier mereka sendiri. Mereka datang dengan kebingungan dan pulang dengan kejelasan. Mereka datang merasa stuck dan pulang dengan momentum. Dan yang paling membahagiakan kami: banyak dari mereka yang kemudian mereferensikan teman atau kolega mereka ke kami, bukan karena kami minta, tapi karena mereka benar-benar merasakan dampaknya.',
  },
  nextProject: { slug: 'brand-identity-fintech-startup', title: 'Membangun Identitas Visual untuk Startup Fintech' },
};

const en: ProjectDetail = {
  slug: 'business-process-optimization',
  category: 'consultancy',
  title: 'Dozens of Professionals, One Personal Approach',
  subtitle: 'A compilation of stories from professionals we have guided in navigating their careers.',
  industry: 'Career & Professional Development',
  year: '2024-2025',
  duration: 'Ongoing',
  overview: 'SAIKI Consultancy does not work with companies. We work with people. Every person who comes to us brings a different story, anxiety, and hope. Some feel stuck after years in the same position. Some just graduated and do not know where to start. Some want to switch industries but fear losing what they have built. This page is a compilation of cases we have handled and resolved, told anonymously to respect each individual\'s privacy.',
  sections: [
    {
      type: 'text',
      heading: 'Why We Compiled These Stories',
      body: 'Whenever someone considers consulting about their career, the first question is usually: "Do other people experience the same thing?" The answer is almost always yes. Career challenges that feel deeply personal often follow patterns that can be mapped.\n\nWe collected these stories not to show off client numbers, but so that you, the reader, can see yourself in one of these stories and know that there is a proven way forward.',
    },
    {
      type: 'full-width-statement',
      statement: 'Everyone who comes to us is not incapable. They come because they need a fresh perspective from someone who has seen hundreds of similar career patterns.',
    },
    {
      type: 'gallery-text',
      heading: 'Common Case Patterns We Encounter',
      body: 'From dozens of professionals we have guided, there are several challenge patterns that consistently emerge, regardless of industry or job level.',
      items: [
        {
          label: '"I\'m stuck but I don\'t know why"',
          description: 'Professionals with 5-10 years of experience who feel their career is going nowhere. Their performance is good, but there is no growth. After digging deeper, the issue is usually not competence but visibility and positioning within the organization.',
        },
        {
          label: '"I want to switch but I\'m afraid of starting over"',
          description: 'Career changers who want to move to a different industry or function. Their biggest fear: losing seniority and having to start from the bottom. In reality, many skills are transferable when framed correctly.',
        },
        {
          label: '"I just graduated and have no idea where to go"',
          description: 'Fresh graduates overwhelmed by choices. Pressure from family, peers, and social media makes it hard to listen to their own voice. We help them filter the noise and find a direction that genuinely fits.',
        },
        {
          label: '"I want to level up but keep getting passed over"',
          description: 'Middle managers ready for promotion but always "almost there." There is usually a gap between their self-perception and decision makers\' perception. We help bridge that gap.',
        },
        {
          label: '"I\'m not sure about my personal brand"',
          description: 'Professionals who know that in the digital era, online presence matters, but do not know how to present themselves. Their LinkedIn is empty or generic. We help build an authentic professional narrative.',
        },
      ],
    },
    {
      type: 'highlight',
      heading: 'Our Approach: Not Generic Coaching',
      body: 'We do not use a one-size-fits-all framework. Every session starts with listening. We believe the answer to someone\'s career challenge usually already exists within them, it just needs to be uncovered and structured. Our role is to be an honest mirror, an accurate map, and a patient motivator. We provide concrete steps that can be executed this week, not abstract inspiration that evaporates tomorrow.',
    },
    {
      type: 'process-steps',
      heading: 'How Our Sessions Work',
      steps: [
        {
          number: '01',
          title: 'Initial Conversation (Free)',
          description: 'A casual 30-minute chat to understand the situation and see if we can help. No commitment, no pressure. Sometimes, this initial conversation alone provides the clarity needed.',
        },
        {
          number: '02',
          title: 'Assessment & Mapping',
          description: 'If we proceed, we conduct a deep assessment: strengths, experience, interests, life values, and market conditions. The result is an honest situation map, not sugarcoating.',
        },
        {
          number: '03',
          title: 'Strategy & Action Plan',
          description: 'From the situation map, we create a specific strategy and action plan. Not "improve networking" but "contact these 3 people next week with a message like this."',
        },
        {
          number: '04',
          title: 'Execution & Guidance',
          description: 'Over several weeks, we guide execution: CV reviews, interview practice, LinkedIn content feedback, or negotiation strategies. We are there at every critical step.',
        },
        {
          number: '05',
          title: 'Review & Calibration',
          description: 'After certain milestones are reached, we review results and recalibrate strategy if needed. A career is a long journey, and we make sure the foundation is strong.',
        },
      ],
    },
    {
      type: 'two-column',
      left: {
        heading: 'Story A: From 7 Years Stuck to Promoted in 4 Months',
        body: 'A professional in the banking industry felt their career had been stagnant for 7 years. Their performance always "met expectations" but never stood out. After assessment, we found the issue was not competence but how they positioned their contributions. They did a lot of important work but never ensured decision makers knew. Within 4 months of applying the visibility strategy we designed, they received the promotion they had been waiting years for.',
      },
      right: {
        heading: 'Story B: Career Switch from Finance to Tech Without Starting Over',
        body: 'A finance manager wanted to move to the tech industry but feared starting from a junior position. We helped map transferable skills: analytical thinking, stakeholder management, and business acumen. We reframed their finance background not as "the wrong background" but as "a unique and rare perspective in tech." Within 3 months, they were hired as a business operations manager at a tech company, at a level equivalent to their previous position.',
      },
    },
    {
      type: 'two-column',
      left: {
        heading: 'Story C: A Fresh Graduate Who Found Their Direction',
        body: 'A recent communications graduate felt lost. Family suggested becoming a civil servant, friends were working at agencies, and social media said to become an entrepreneur. After our assessment session, we found their interests and strengths best suited a role in corporate communications. We helped build a focused CV, practiced interviews, and created a targeted application strategy. Within 2 months, they landed a position at a company they never imagined they could enter.',
      },
      right: {
        heading: 'Story D: Building a Personal Brand from Scratch',
        body: 'An independent consultant had exceptional expertise but zero online presence. New clients always came from referrals, and they wanted to expand their reach. We helped build a professional narrative, optimize their LinkedIn profile, and create a weekly content strategy they could execute independently. Within 6 months, their LinkedIn followers grew organically and they started receiving inbound leads from people they had never met before.',
      },
    },
    {
      type: 'metrics',
      heading: 'Cumulative Impact',
      items: [
        { value: '30+', label: 'Professionals we have guided' },
        { value: '85%', label: 'Achieved career goals within 6 months' },
        { value: '100%', label: 'Felt clearer about career direction' },
        { value: '4.9', label: 'Average satisfaction rating (out of 5)' },
      ],
    },
    {
      type: 'quote',
      text: 'I came with one question: what should I do? I left not just with an answer, but with a complete map and a clear first step.',
      attribution: 'One of the professionals we guided',
    },
  ],
  outcome: {
    heading: 'Not Just Consultation, But a Turning Point',
    body: 'From all the professionals we have guided, the most consistent pattern is not about "getting a new job" or "getting a raise." The most consistent pattern is a shift in how they see their own careers. They came confused and left with clarity. They came feeling stuck and left with momentum. And what makes us happiest: many of them then referred friends or colleagues to us, not because we asked, but because they truly felt the impact.',
  },
  nextProject: { slug: 'brand-identity-fintech-startup', title: 'Building a Visual Identity for a Fintech Startup' },
};

registerProject('business-process-optimization', { id: () => id, en: () => en });
