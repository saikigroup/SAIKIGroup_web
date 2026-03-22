# SAIKI Group — Company Website

Production-ready editorial bilingual company website for SAIKI Group, built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion.

## Business Lines

1. **SAIKI Consultancy** — Career consultancy, career direction, professional development, job readiness
2. **SAIKI Imagery** — Branding & marketing, brand identity, communication, campaigns, content direction
3. **SAIKI Technology** — White-label software, custom software, internal business systems, workflow digitization

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Icons**: lucide-react
- **Database**: Supabase (for inquiry storage)
- **Internationalization**: Custom locale routing (ID/EN)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Base URL for metadata/sitemap (default: `https://saiki.id`) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta (Facebook) Pixel ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Project Structure

```
app/
  [locale]/              # Locale-based routing (id, en)
    page.tsx             # Homepage
    tentang/page.tsx     # About page
    layanan/             # Services
      page.tsx           # Services overview
      consultancy/       # SAIKI Consultancy
      imagery/           # SAIKI Imagery
      technology/        # SAIKI Technology
    insights/page.tsx    # Journal/Insights
    kontak/page.tsx      # Contact
    layout.tsx           # Locale layout with header/footer
  api/inquiry/route.ts   # Inquiry submission API
  layout.tsx             # Root layout
  globals.css            # Global styles + design tokens
  robots.ts              # Robots.txt generation
  sitemap.ts             # XML sitemap generation
components/
  layout/                # Header, Footer, Logo, LanguageSwitch, Analytics
  sections/              # Page section components
  shared/                # Reusable UI components
  motion/                # Animation wrapper components
  forms/                 # Contact form
content/
  locales/id/            # Indonesian content dictionaries
  locales/en/            # English content dictionaries
  seo.ts                 # SEO metadata per page
lib/
  i18n.ts                # Internationalization utilities
  content.ts             # Content access layer
  analytics.ts           # Event tracking utilities
  attribution.ts         # UTM/referrer capture
  metadata.ts            # Metadata + JSON-LD generators
  motion.ts              # Animation variants
  supabase.ts            # Supabase client + types
  utils.ts               # Shared utilities
docs/
  brand_assets/          # Brand logos and assets
  database/              # SQL migrations
  STRATEGY.md            # Strategy & architecture document
```

## Bilingual System

- **Default language**: Indonesian (ID)
- **Supported**: ID, EN
- **Routing**: `/id/...` and `/en/...`
- **Content**: Centralized TypeScript dictionaries in `content/locales/`
- **Language switch**: Visible toggle in the header on all breakpoints

### Adding/editing translations

1. Edit the corresponding file in `content/locales/id/` and `content/locales/en/`
2. Both locale files share the same structure — keep them in sync
3. All content keys must exist in both languages

## Contact Form & Inquiry Storage

The contact form submits to `/api/inquiry` which stores data in Supabase.

### Database Setup

1. Create a Supabase project
2. Run the SQL in `docs/database/saikiweb_inquiries.sql` in the Supabase SQL Editor
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

Table: `saikiweb_inquiries` — stores all visitor inquiries with attribution data.

If Supabase is not configured, the form still works (inquiry is logged to console).

## Analytics & Attribution

### Event Tracking

Events are pushed to the GTM dataLayer. See `lib/analytics.ts` for the full event list:
- `page_view`, `language_switch`, `service_cta_click`, `contact_cta_click`
- `form_start`, `form_submit`, `whatsapp_click`, `email_click`
- `journal_click`, `outbound_click`

### Attribution Capture

UTM parameters, referrer, landing page, and click IDs (gclid, fbclid) are captured on page load and submitted as hidden fields with the contact form. See `lib/attribution.ts`.

### Configuring Analytics

1. Set GTM ID in `NEXT_PUBLIC_GTM_ID`
2. Set Meta Pixel ID in `NEXT_PUBLIC_META_PIXEL_ID`
3. Configure GA4 within GTM, or set `NEXT_PUBLIC_GA4_ID` for direct integration

## SEO

- Per-page meta titles and descriptions in both ID and EN
- Open Graph tags for social sharing
- JSON-LD structured data (Organization, WebSite, Service, Article)
- XML sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- Semantic HTML with proper heading hierarchy
- Canonical URLs with locale handling

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-teal` | `#2f4f50` | Primary brand |
| `brand-grey` | `#6a7b8d` | Secondary |
| `brand-black` | `#1d1d1b` | Text primary |
| `accent-consultancy` | `#660e36` | Consultancy line |
| `accent-imagery` | `#117a8c` | Imagery line |
| `accent-technology` | `#1a3a5c` | Technology line |
| `surface-cream` | `#faf8f5` | Light background |
| `surface-light` | `#f5f3f0` | Alternate background |

### Typography

- **Primary**: Inter (sans-serif) — body text, headings, UI
- **Accent**: Playfair Display (serif) — editorial headings

### Brand Assets

Source-of-truth assets are in `docs/brand_assets/`. The logo SVG is embedded in the `Logo` component. Favicon uses the SAIKI symbol mark.

## Contact Information

- **Email**: info@saiki.id
- **Phone**: 087788980088
- **Address**: Everywhere close to everyone who wants to move now.
