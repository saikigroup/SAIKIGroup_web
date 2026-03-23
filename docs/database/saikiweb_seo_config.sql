-- ============================================================
-- SEO Configuration Table & Seed
-- Stores all SEO metadata, structured data, verification codes,
-- and robots config in a single JSONB row.
-- ============================================================

-- 1. Create table (single-row enforced via CHECK constraint)
CREATE TABLE IF NOT EXISTS saikiweb_seo_config (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable RLS (only service role can access)
ALTER TABLE saikiweb_seo_config ENABLE ROW LEVEL SECURITY;

-- 3. Insert comprehensive seed data
INSERT INTO saikiweb_seo_config (id, config)
VALUES (1, '{
  "global": {
    "siteName": "SAIKI Group",
    "siteUrl": "https://saiki.id",
    "defaultDescription": "SAIKI Group adalah ekosistem terintegrasi untuk konsultansi karier, branding & pemasaran, dan pengembangan teknologi.",
    "ogImage": "/og-image.png",
    "favicon": "/favicon.svg"
  },
  "verification": {
    "google": "",
    "bing": ""
  },
  "organization": {
    "name": "SAIKI Group",
    "email": "info@saiki.id",
    "phone": "+6287788980088",
    "logo": "/images/logo.svg",
    "socialLinks": [
      "https://instagram.com/saikigroup",
      "https://linkedin.com/company/saikigroup",
      "https://tiktok.com/@saikigroup"
    ]
  },
  "pages": {
    "home": {
      "id": {
        "title": "SAIKI Group | Konsultansi, Branding & Teknologi",
        "description": "SAIKI Group adalah ekosistem terintegrasi untuk konsultansi karier, branding & pemasaran, dan pengembangan teknologi. Bergerak sekarang untuk masa depan lebih baik.",
        "ogTitle": "SAIKI Group | Bergerak Sekarang",
        "ogDescription": "Konsultansi karier, branding, dan teknologi dalam satu ekosistem terintegrasi. Wujudkan potensi bisnis dan karier Anda.",
        "keywords": ["konsultansi karier", "branding", "teknologi", "SAIKI Group", "pengembangan bisnis", "pemasaran digital", "software development", "konsultan bisnis Indonesia", "agensi branding Jakarta"]
      },
      "en": {
        "title": "SAIKI Group | Consultancy, Branding & Technology",
        "description": "SAIKI Group is an integrated ecosystem for career consultancy, branding & marketing, and technology development. Move now for a better future.",
        "ogTitle": "SAIKI Group | Move Now",
        "ogDescription": "Career consultancy, branding, and technology in one integrated ecosystem. Unlock your business and career potential.",
        "keywords": ["career consultancy", "branding", "technology", "SAIKI Group", "business development", "digital marketing", "software development", "business consultant Indonesia", "branding agency"]
      }
    },
    "about": {
      "id": {
        "title": "Tentang SAIKI | Dibangun untuk Masa Kini",
        "description": "Pelajari bagaimana SAIKI Group menggabungkan konsultansi, branding, dan teknologi dalam satu ekosistem yang terintegrasi untuk membantu bisnis dan individu berkembang.",
        "ogTitle": "Tentang SAIKI Group",
        "ogDescription": "Ekosistem terintegrasi konsultansi, branding, dan teknologi.",
        "keywords": ["tentang SAIKI", "profil perusahaan", "ekosistem bisnis", "konsultansi Indonesia", "sejarah SAIKI Group", "visi misi"]
      },
      "en": {
        "title": "About SAIKI | Built for the Present",
        "description": "Learn how SAIKI Group combines consultancy, branding, and technology in one integrated ecosystem to help businesses and individuals grow.",
        "ogTitle": "About SAIKI Group",
        "ogDescription": "An integrated ecosystem of consultancy, branding, and technology.",
        "keywords": ["about SAIKI", "company profile", "business ecosystem", "Indonesia consultancy", "SAIKI Group history", "vision mission"]
      }
    },
    "services": {
      "id": {
        "title": "Layanan SAIKI | Konsultansi, Imagery, Technology",
        "description": "Tiga lini bisnis SAIKI: konsultansi karier strategis, branding & pemasaran kreatif, dan pengembangan software custom. Temukan layanan yang tepat untuk kebutuhan Anda.",
        "ogTitle": "Layanan SAIKI Group",
        "ogDescription": "Konsultansi, branding, dan teknologi dalam tiga lini bisnis terintegrasi.",
        "keywords": ["layanan konsultansi", "jasa branding", "pengembangan software", "layanan teknologi", "SAIKI services", "jasa konsultan karier", "digital agency Indonesia"]
      },
      "en": {
        "title": "SAIKI Services | Consultancy, Imagery, Technology",
        "description": "Three SAIKI business lines: strategic career consultancy, creative branding & marketing, and custom software development. Find the right service for your needs.",
        "ogTitle": "SAIKI Group Services",
        "ogDescription": "Consultancy, branding, and technology across three integrated business lines.",
        "keywords": ["consultancy services", "branding services", "software development", "technology services", "SAIKI services", "career consultant", "digital agency Indonesia"]
      }
    },
    "consultancy": {
      "id": {
        "title": "SAIKI Consultancy | Konsultansi & Arah Karier",
        "description": "Konsultansi karier strategis: arah karier, pengembangan profesional, persiapan kerja, positioning yang tepat, dan career coaching untuk mencapai potensi terbaik Anda.",
        "ogTitle": "SAIKI Consultancy",
        "ogDescription": "Konsultansi karier strategis untuk pengembangan profesional Anda.",
        "keywords": ["konsultansi karier", "arah karier", "pengembangan profesional", "persiapan kerja", "career coaching Indonesia", "konsultan karier Jakarta", "career planning", "job preparation"]
      },
      "en": {
        "title": "SAIKI Consultancy | Career Direction & Consulting",
        "description": "Strategic career consultancy: career direction, professional development, job readiness, smart positioning, and career coaching to reach your full potential.",
        "ogTitle": "SAIKI Consultancy",
        "ogDescription": "Strategic career consultancy for your professional development.",
        "keywords": ["career consultancy", "career direction", "professional development", "job readiness", "career coaching", "career planning", "job preparation", "Indonesia career consultant"]
      }
    },
    "imagery": {
      "id": {
        "title": "SAIKI Imagery | Branding & Pemasaran",
        "description": "Branding dan pemasaran yang membangun koneksi: identitas brand, strategi komunikasi, kampanye kreatif, konten berkualitas, dan social media management.",
        "ogTitle": "SAIKI Imagery",
        "ogDescription": "Branding dan pemasaran yang membangun koneksi autentik.",
        "keywords": ["branding", "pemasaran digital", "identitas brand", "strategi komunikasi", "desain grafis", "konten marketing", "social media management", "agensi branding Indonesia"]
      },
      "en": {
        "title": "SAIKI Imagery | Branding & Marketing",
        "description": "Branding and marketing that builds connections: brand identity, communication strategy, creative campaigns, quality content, and social media management.",
        "ogTitle": "SAIKI Imagery",
        "ogDescription": "Branding and marketing that builds authentic connections.",
        "keywords": ["branding", "digital marketing", "brand identity", "communication strategy", "graphic design", "content marketing", "social media management", "Indonesia branding agency"]
      }
    },
    "technology": {
      "id": {
        "title": "SAIKI Technology | Pengembangan Software",
        "description": "Solusi software untuk kebutuhan nyata: custom development, white-label solutions, sistem bisnis internal, web & mobile apps, dan customization platform.",
        "ogTitle": "SAIKI Technology",
        "ogDescription": "Solusi software custom untuk kebutuhan bisnis Anda.",
        "keywords": ["pengembangan software", "custom development", "white-label", "sistem bisnis", "aplikasi web", "teknologi Indonesia", "web developer Jakarta", "mobile app development", "SaaS development"]
      },
      "en": {
        "title": "SAIKI Technology | Software Development",
        "description": "Software solutions for real needs: custom development, white-label solutions, internal business systems, web & mobile apps, and platform customization.",
        "ogTitle": "SAIKI Technology",
        "ogDescription": "Custom software solutions for your business needs.",
        "keywords": ["software development", "custom development", "white-label", "business systems", "web applications", "Indonesia tech", "web developer", "mobile app development", "SaaS development"]
      }
    },
    "insights": {
      "id": {
        "title": "Insights SAIKI | Perspektif & Pemikiran",
        "description": "Artikel, analisis, dan insight dari tim SAIKI tentang karier, branding, teknologi, strategi bisnis, dan tren industri terkini.",
        "ogTitle": "SAIKI Insights",
        "ogDescription": "Perspektif dan pemikiran dari tim SAIKI tentang karier, branding, dan teknologi.",
        "keywords": ["artikel bisnis", "insight karier", "branding tips", "teknologi terbaru", "blog SAIKI", "strategi bisnis", "tren industri", "pengembangan karier"]
      },
      "en": {
        "title": "SAIKI Insights | Perspectives & Thoughts",
        "description": "Articles, analyses, and insights from the SAIKI team on careers, branding, technology, business strategy, and the latest industry trends.",
        "ogTitle": "SAIKI Insights",
        "ogDescription": "Perspectives and thoughts from the SAIKI team on careers, branding, and technology.",
        "keywords": ["business articles", "career insights", "branding tips", "latest technology", "SAIKI blog", "business strategy", "industry trends", "career development"]
      }
    },
    "contact": {
      "id": {
        "title": "Kontak SAIKI | Hubungi Kami",
        "description": "Hubungi SAIKI Group untuk konsultansi karier, branding, pengembangan software, atau kolaborasi. Konsultasi awal gratis untuk kebutuhan Anda.",
        "ogTitle": "Hubungi SAIKI Group",
        "ogDescription": "Konsultasi gratis untuk karier, branding, dan teknologi.",
        "keywords": ["kontak SAIKI", "hubungi kami", "konsultasi gratis", "kolaborasi bisnis", "konsultansi karier gratis", "jasa branding murah"]
      },
      "en": {
        "title": "Contact SAIKI | Get in Touch",
        "description": "Contact SAIKI Group for career consultancy, branding, software development, or collaboration. Free initial consultation for your needs.",
        "ogTitle": "Contact SAIKI Group",
        "ogDescription": "Free consultation for career, branding, and technology.",
        "keywords": ["contact SAIKI", "get in touch", "free consultation", "business collaboration", "free career consultancy", "branding services"]
      }
    }
  },
  "robots": {
    "disallow": ["/api/", "/_next/", "/admin/"]
  }
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  config = EXCLUDED.config,
  updated_at = now();
