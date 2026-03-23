import { registerProject, type ProjectDetail } from '../registry';

const id: ProjectDetail = {
  slug: 'visual-campaign-fnb-chain',
  category: 'imagery',
  title: 'Kampanye Visual untuk Jaringan F&B Nasional',
  subtitle: 'Konsistensi brand di 50+ kota tanpa kehilangan nuansa lokal.',
  industry: 'Food & Beverage',
  year: '2024',
  duration: '4 bulan',
  overview: 'Jaringan restoran dengan lebih dari 50 cabang di seluruh Indonesia menghadapi dilema yang sering dialami bisnis F&B yang berkembang pesat: bagaimana menjaga konsistensi brand di semua kota sambil tetap terasa relevan dan dekat dengan komunitas lokal. Kampanye visual mereka sebelumnya terasa generik, atau sebaliknya, terlalu lokal hingga tidak terasa seperti satu brand. Kami diminta untuk menciptakan framework kampanye visual yang bisa diadaptasi tanpa kehilangan identitas.',
  sections: [
    {
      type: 'two-column',
      left: {
        heading: 'Situasi Awal',
        body: 'Setiap cabang punya "versi sendiri" dalam mengeksekusi materi kampanye. Beberapa cabang mencetak banner dengan warna yang salah. Yang lain menambahkan elemen lokal yang tidak selaras dengan brand guidelines. Hasilnya, pengalaman visual pelanggan berbeda drastis antara satu kota dan kota lainnya. Di saat yang sama, kampanye yang terlalu rigid dari pusat sering terasa asing dan tidak relevan untuk audiens lokal.',
      },
      right: {
        heading: 'Apa yang Dibutuhkan',
        body: 'Bukan sekadar template yang seragam, tapi sebuah sistem visual yang cukup fleksibel untuk mengakomodasi nuansa lokal namun cukup terstruktur untuk menjaga brand integrity. Sistem ini juga harus praktis: bisa dieksekusi oleh tim marketing regional yang mungkin tidak punya background desain profesional, dengan waktu produksi yang cepat karena menu dan promosi berubah secara berkala.',
      },
    },
    {
      type: 'highlight',
      heading: 'Insight Kunci yang Mengubah Arah',
      body: 'Saat melakukan field visit ke beberapa cabang di kota-kota berbeda, kami menemukan sesuatu yang menarik: adaptasi lokal yang "nakal" justru sering kali menghasilkan engagement yang lebih tinggi. Foto makanan yang di-style dengan latar khas daerah, penggunaan bahasa lokal di tagline promo, dan referensi budaya setempat membuat konten terasa lebih personal. Tantangannya bukan menghilangkan keunikan ini, tapi memberikan kerangka agar keunikan tersebut tetap on-brand.',
    },
    {
      type: 'gallery-text',
      heading: 'Komponen Sistem yang Kami Bangun',
      body: 'Kami merancang sebuah "campaign toolkit" modular yang terdiri dari beberapa layer yang bisa dicampur dan dipadukan sesuai kebutuhan lokal.',
      items: [
        {
          label: 'Core Visual Layer',
          description: 'Elemen-elemen yang tidak boleh berubah: logo placement, primary color palette, dan typography hierarchy. Ini adalah "tulang punggung" yang memastikan setiap materi tetap dikenali sebagai bagian dari brand yang sama.',
        },
        {
          label: 'Flexible Content Zone',
          description: 'Area dalam setiap template yang bisa diisi dengan konten lokal: foto produk regional, promo khusus kota, atau event lokal. Zone ini sudah pre-defined ukuran dan posisinya, tapi isinya bebas.',
        },
        {
          label: 'Local Flavor Module',
          description: 'Kumpulan pattern, ilustrasi, dan color accent yang terinspirasi dari budaya lokal berbagai region. Tim cabang bisa memilih modul yang sesuai dengan kota mereka tanpa harus mendesain dari nol.',
        },
        {
          label: 'Quick Production Guide',
          description: 'Panduan step-by-step yang ditulis dalam bahasa non-teknis, lengkap dengan do\'s and don\'ts, agar tim marketing regional bisa memproduksi materi kampanye yang on-brand dalam hitungan jam.',
        },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'Konsistensi bukan berarti keseragaman. Konsistensi adalah ketika pelanggan mengenali brand Anda di mana pun mereka berada, sambil tetap merasa bahwa brand tersebut "mengerti" mereka.',
    },
    {
      type: 'metrics',
      heading: 'Hasil Kampanye',
      items: [
        { value: '50+', label: 'Cabang mengadopsi sistem baru' },
        { value: '62%', label: 'Pengurangan waktu produksi materi' },
        { value: '3.2x', label: 'Peningkatan engagement sosial media regional' },
        { value: '89%', label: 'Brand consistency score (dari 41%)' },
      ],
    },
  ],
  outcome: {
    heading: 'Framework yang Hidup dan Berkembang',
    body: 'Sistem kampanye visual ini sekarang menjadi standar operasional jaringan restoran tersebut. Yang paling memuaskan bukan hanya angka-angkanya, tapi fakta bahwa tim marketing regional merasa lebih percaya diri dan kreatif karena mereka punya kerangka yang jelas. Mereka tidak lagi takut "salah" karena guidelines sudah menjadi enabler, bukan pembatas. Beberapa adaptasi lokal yang dihasilkan tim cabang bahkan diadopsi menjadi template nasional karena performanya yang luar biasa.',
  },
  nextProject: { slug: 'corporate-rebranding-manufaktur', title: 'Rebranding Korporat Perusahaan Manufaktur' },
};

const en: ProjectDetail = {
  slug: 'visual-campaign-fnb-chain',
  category: 'imagery',
  title: 'Visual Campaign for a National F&B Chain',
  subtitle: 'Brand consistency across 50+ cities without losing local nuance.',
  industry: 'Food & Beverage',
  year: '2024',
  duration: '4 months',
  overview: 'A restaurant chain with more than 50 locations across Indonesia faced a dilemma common to fast-growing F&B businesses: how to maintain brand consistency across all cities while still feeling relevant and close to local communities. Their previous visual campaigns felt either generic, or conversely, too localized to feel like one brand. We were asked to create a visual campaign framework that could adapt without losing its identity.',
  sections: [
    {
      type: 'two-column',
      left: {
        heading: 'The Starting Point',
        body: 'Each branch had its own "version" of executing campaign materials. Some branches printed banners with incorrect colors. Others added local elements that did not align with brand guidelines. The result was a drastically different visual experience from one city to another. At the same time, overly rigid campaigns from headquarters often felt foreign and irrelevant to local audiences.',
      },
      right: {
        heading: 'What Was Needed',
        body: 'Not just uniform templates, but a visual system flexible enough to accommodate local nuances yet structured enough to maintain brand integrity. This system also had to be practical: executable by regional marketing teams who may not have professional design backgrounds, with fast production times since menus and promotions change regularly.',
      },
    },
    {
      type: 'highlight',
      heading: 'The Key Insight That Changed Direction',
      body: 'During field visits to branches in different cities, we discovered something interesting: "rebellious" local adaptations often generated higher engagement. Food photos styled with regional backdrops, local language in promo taglines, and cultural references made content feel more personal. The challenge was not to eliminate this uniqueness, but to provide a framework so that uniqueness stays on-brand.',
    },
    {
      type: 'gallery-text',
      heading: 'System Components We Built',
      body: 'We designed a modular "campaign toolkit" consisting of several layers that can be mixed and matched according to local needs.',
      items: [
        {
          label: 'Core Visual Layer',
          description: 'Elements that must not change: logo placement, primary color palette, and typography hierarchy. This is the "backbone" ensuring every material is recognized as part of the same brand.',
        },
        {
          label: 'Flexible Content Zone',
          description: 'An area within each template that can be filled with local content: regional product photos, city-specific promos, or local events. These zones have pre-defined sizes and positions, but the content is free.',
        },
        {
          label: 'Local Flavor Module',
          description: 'A collection of patterns, illustrations, and color accents inspired by local cultures across regions. Branch teams can select modules matching their city without designing from scratch.',
        },
        {
          label: 'Quick Production Guide',
          description: 'A step-by-step guide written in non-technical language, complete with do\'s and don\'ts, so regional marketing teams can produce on-brand campaign materials within hours.',
        },
      ],
    },
    {
      type: 'full-width-statement',
      statement: 'Consistency does not mean uniformity. Consistency is when customers recognize your brand wherever they are, while still feeling that the brand "gets" them.',
    },
    {
      type: 'metrics',
      heading: 'Campaign Results',
      items: [
        { value: '50+', label: 'Branches adopted the new system' },
        { value: '62%', label: 'Reduction in material production time' },
        { value: '3.2x', label: 'Increase in regional social media engagement' },
        { value: '89%', label: 'Brand consistency score (up from 41%)' },
      ],
    },
  ],
  outcome: {
    heading: 'A Framework That Lives and Grows',
    body: 'This visual campaign system is now the operational standard for the restaurant chain. What is most satisfying is not just the numbers, but the fact that regional marketing teams feel more confident and creative because they have a clear framework. They are no longer afraid of being "wrong" because the guidelines have become enablers, not constraints. Some local adaptations produced by branch teams were even adopted as national templates due to their outstanding performance.',
  },
  nextProject: { slug: 'corporate-rebranding-manufaktur', title: 'Corporate Rebranding for a Manufacturing Company' },
};

registerProject('visual-campaign-fnb-chain', { id: () => id, en: () => en });
