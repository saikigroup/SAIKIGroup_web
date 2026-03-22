# SAIKI Group Website — Strategy & Architecture Document

## 1. Public Brand Research Summary

### Website (saiki.id)
- SAIKI Group positions itself as a multi-vertical Indonesian startup
- Tagline: "Beyond Your Needs"
- The brand mark is a stylized power-button / compass motif — symbolizing activation, direction, and immediacy
- Current public presence shows consulting and imagery as established lines
- Visual language leans professional but not overly corporate

### BlastMail (blastmail.saiki.id)
- Email marketing SaaS product under the SAIKI Technology umbrella
- Clean, modern product landing page with clear feature breakdowns
- Bilingual support (ID/EN) with a visible language toggle
- Strong CTA structure: tiered pricing, free trial emphasis
- Tone: practical, direct, benefit-driven
- Credibility signals: feature lists, use-case framing

### apick (apick.id)
- Practical, everyday-use digital product
- More approachable and grounded personality than BlastMail
- Copy feels local, useful, human — not overly formal
- Modular offering communication
- Clean UI with clear product storytelling
- Direct, no-nonsense CTA patterns

### Synthesis
- SAIKI has a consistent pattern of clean, functional digital products
- The umbrella brand needs stronger editorial identity to differentiate from product-level pages
- Language switching is established but needs more polish on the company site level
- Current public presence undersells the strategic depth of the business

---

## 2. Business Correction Layer

### Removed: SAIKI Culinary
SAIKI Culinary is **obsolete** and must not appear anywhere in the website — not in copy, nav, metadata, structured data, alt text, code comments, or documentation.

### Current Business Lines (3)
1. **SAIKI Consultancy** — career consultancy, career direction, professional development, job readiness/positioning/guidance
2. **SAIKI Imagery** — branding & marketing, brand identity, communication, campaigns, content direction, marketing support
3. **SAIKI Technology** — white-label software, custom software, software customization, internal business systems/portals/dashboards/workflow digitization

### Implications
- IA must reflect exactly 3 business lines
- Technology must have equal visual and strategic weight (not feel tacked on)
- Sub-brand color system must accommodate all 3 (Technology needs a new accent color)

---

## 3. Brand Asset Audit

### Assets Found in `docs/brand_assets/`

| Asset | Type | Purpose | Usage |
|-------|------|---------|-------|
| `Main Logo no tagline-01.png` | PNG 1250×1250 | Primary brand mark (symbol + "SAIKI" wordmark) | Light backgrounds, hero, headers |
| `saiki main logo-01.png` | PNG 1250×1667 | Symbol only (no text) | Light backgrounds, favicon candidate |
| `saiki main logo-01.svg` | SVG | Symbol only (scalable) | Primary vector symbol for web |
| `saiki white no text.svg` | SVG | White symbol only | Dark backgrounds, footer |
| `saiki white.svg` | SVG | White symbol (compact) | Dark backgrounds, overlays |
| `SAIKI group 2-01.png` | PNG 1772×827 | Full lockup with tagline "Beyond Your Needs" | Presentations, about page |
| `SAIKI CONSULTANCY-01.png` | PNG 1772×827 | Consultancy sub-brand (stacked) | Consultancy page hero |
| `SAIKI CONSULTANCY POTRAIT-01.png` | PNG 1772×355 | Consultancy sub-brand (horizontal) | Consultancy page inline |
| `SAIKI CONSULTANCY.svg` | SVG | Consultancy sub-brand lockup | Web vector usage |
| `SAIKI IMAGERY.svg` | SVG | Imagery sub-brand lockup | Web vector usage |

### Missing Assets
- No SAIKI Technology sub-brand asset — Technology accent color will be derived from palette logic

### Extracted Color Palette

| Role | Hex | Description |
|------|-----|-------------|
| Primary Dark Teal | `#2f4f50` | Main brand color, symbol primary |
| Secondary Blue-Grey | `#6a7b8d` | Symbol secondary, supporting elements |
| Near Black | `#1d1d1b` | Primary text, "SAIKI" wordmark |
| Consultancy Accent | `#660e36` | Deep burgundy/maroon |
| Imagery Accent | `#117a8c` | Teal/cyan |
| Technology Accent | `#1a3a5c` | Deep navy (derived — complements teal family) |
| White | `#ffffff` | Backgrounds, inverse elements |

### Usage Rules
- **Light backgrounds**: Use colored symbol (`saiki main logo-01.svg`) or full lockup PNGs
- **Dark backgrounds**: Use white symbol variants (`saiki white.svg`, `saiki white no text.svg`)
- **Favicon**: Derive from symbol-only mark
- **Sub-brand pages**: Use respective sub-brand SVGs with their accent colors
- **Never**: Stretch, recolor, or alter the symbol proportions

---

## 4. Editorial Concept Statement

**"Now, in motion."**

SAIKI means "sekarang" — now. The website embodies this through an editorial lens: every element communicates present-tense relevance, active movement, and informed immediacy.

The design treats the company website like a contemporary editorial publication — story-led, typographically strong, rhythmically paced — merged with the precision and interactivity of a premium digital studio. The result is a site that feels alive, current, and strategically sharp.

The "now" concept is not decorative. It is structural: reflected in the copy cadence, the section pacing, the interactive responses, and the positioning language. SAIKI doesn't promise the future — it operates in the present tense.

---

## 5. Design Principles

1. **Editorial-first** — Layout, typography, and rhythm take cues from contemporary magazine design
2. **Present tense** — Every element communicates currency and relevance
3. **Interactive intelligence** — Motion and interaction reward exploration without overwhelming
4. **Restrained premium** — Quality through proportion, spacing, and typography — not decoration
5. **Unified diversity** — Three business lines feel distinct but unmistakably part of one brand
6. **Bilingual by architecture** — Language is not patched in; it's designed into the content system
7. **Conversion clarity** — Every page has purpose; every CTA has context

---

## 6. Sitemap & Page Architecture

| Page | Route (ID) | Route (EN) | Role |
|------|-----------|-----------|------|
| Home | `/id` | `/en` | Brand introduction, business overview, editorial impression |
| Tentang / About | `/id/tentang` | `/en/about` | Company story, operating model, team philosophy |
| Layanan / Services | `/id/layanan` | `/en/services` | Business lines overview |
| Consultancy | `/id/layanan/consultancy` | `/en/services/consultancy` | Career consultancy depth |
| Imagery | `/id/layanan/imagery` | `/en/services/imagery` | Branding & marketing depth |
| Technology | `/id/layanan/technology` | `/en/services/technology` | Software development depth |
| Insights | `/id/insights` | `/en/insights` | Journal/editorial articles |
| Kontak / Contact | `/id/kontak` | `/en/contact` | Inquiry form with attribution |

### User Flow
- Discovery → Home → Service interest → Service page → Contact
- Direct → Service page → Contact
- Content → Insights article → Related service → Contact
- Organic → Any page → Language switch → Continue journey

---

## 7. Bilingual Content Strategy

### Architecture
- Locale-based routing: `/[locale]/...` where locale is `id` or `en`
- Default locale: `id`
- Central content dictionaries in `/content/locales/id/` and `/content/locales/en/`
- Shared content structure in TypeScript objects for type safety
- Middleware handles locale detection and redirection

### Language Toggle
- Visible ID/EN toggle in header
- Persists preference via cookie
- Switches URL path without page reload feel
- Clearly indicates active language state
- Accessible: keyboard navigable, screen-reader friendly

### Content Sync Rules
- All keys must exist in both locale files
- TypeScript interfaces enforce completeness
- Navigation, hero copy, service descriptions, CTAs, metadata, journal previews — all bilingual
- No mixed-language broken states

---

## 8. Conversion & Contact Strategy

### Inquiry Routes
1. General inquiry
2. SAIKI Consultancy inquiry
3. SAIKI Imagery inquiry
4. SAIKI Technology inquiry
5. Partnership/collaboration
6. Career inquiry

### Contact Form Fields
- Name (required)
- Email (required)
- Phone/WhatsApp (optional)
- Company/Organization (optional)
- Inquiry category (required — dropdown with service routing)
- Message (required)
- Budget range (optional)
- Timeline (optional)
- Privacy consent checkbox

### UX Elements
- Helper text explaining field purpose
- Category pre-selection when coming from service pages
- Clear expectation-setting copy (response time, process)
- Success state with next-steps messaging
- Clean validation with inline errors
- Secondary pathways: WhatsApp CTA, direct email

---

## 9. Attribution & Analytics Strategy

### UTM/Referrer Capture
- Parse URL on landing: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- Capture `gclid`, `fbclid` if present
- Store `document.referrer` and landing page URL
- Persist in sessionStorage for form submission
- Submit as hidden fields with contact form

### Event Tracking Plan
| Event | Trigger |
|-------|---------|
| `page_view` | Every page navigation |
| `language_switch` | Language toggle click |
| `service_cta_click` | Any service CTA |
| `contact_cta_click` | Contact/inquiry CTA |
| `form_start` | First form field interaction |
| `form_submit` | Successful form submission |
| `whatsapp_click` | WhatsApp link click |
| `email_click` | Email link click |
| `journal_click` | Article card click |
| `outbound_click` | External link click |

### Implementation
- GA4 via Google Tag Manager (GTM container ID in env var)
- Meta Pixel ID in env var
- Clean analytics utility layer (`/lib/analytics.ts`)
- Attribution utility (`/lib/attribution.ts`)
- Environment variables: `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`

---

## 10. SEO & Visibility Strategy

### Meta Approach
- Every page has unique, intentional `<title>` and `<meta description>` in both languages
- Open Graph tags with branded social preview images
- Canonical URLs with locale handling
- JSON-LD structured data: Organization, WebSite, Service, Article schemas

### Technical SEO
- Semantic HTML5 with proper heading hierarchy
- Descriptive, clean URLs
- XML sitemap generation via Next.js
- `robots.txt` configuration
- Internal linking between services and related insights
- Alt text strategy for all images
- Performance optimization (Next.js Image, font optimization)

### SEM Readiness
- Service pages are conversion-capable landing pages
- CTA structure is measurable
- Form tracking captures attribution
- Architecture supports future campaign-specific pages

---

## 11. Design System Direction

### Typography
- Primary: **Inter** — clean, modern sans-serif with excellent multilingual support
- Accent: **Playfair Display** — restrained serif for editorial headings only
- Scale: 14/16/18/20/24/30/36/48/60/72px with responsive adjustments

### Color Tokens
- `--brand-teal`: #2f4f50
- `--brand-grey`: #6a7b8d
- `--brand-black`: #1d1d1b
- `--brand-white`: #ffffff
- `--accent-consultancy`: #660e36
- `--accent-imagery`: #117a8c
- `--accent-technology`: #1a3a5c
- `--surface-cream`: #faf8f5
- `--surface-light`: #f5f3f0
- `--border-subtle`: #e5e2dd

### Spacing
- Base unit: 4px
- Section padding: 80px (desktop), 48px (mobile)
- Container max-width: 1280px
- Editorial grid: 12-column with asymmetric compositions

### Motion
- Default duration: 0.6s
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Stagger delay: 0.1s
- Scroll-triggered reveals via Framer Motion `useInView`

---

## 12. Component Map

### Layout
- `SiteHeader` — sticky header with nav, language switch, mobile toggle
- `SiteFooter` — brand info, nav links, social, legal
- `MobileNav` — slide-out mobile navigation
- `PageShell` — wraps pages with consistent layout
- `SectionContainer` — max-width container with padding
- `LanguageSwitch` — ID/EN toggle component

### Shared/UI
- `Eyebrow` — small label above headings
- `SectionHeading` — editorial section titles
- `EditorialDivider` — styled section separators
- `CTAButton` — primary/secondary button variants
- `StatBlock` — number + label for stats
- `ServiceTag` — colored tag for business lines
- `JournalCard` — editorial article preview card
- `Caption` — image/content captions

### Homepage Sections
- `HeroEditorial` — full-width hero with editorial composition
- `BrandStatement` — positioning narrative block
- `ServiceOverviewGrid` — 3 business line cards
- `WhySaiki` — approach/philosophy section
- `CapabilityScenarios` — use case scenarios
- `OperatingModel` — how SAIKI works
- `JournalPreview` — latest insights cards
- `ContactCTA` — bottom CTA section

### Service Sections
- `ServiceHero` — service page hero with accent color
- `ServiceScope` — what the service covers
- `ServiceApproach` — methodology
- `ServiceUseCases` — practical scenarios
- `ServiceCTA` — service-specific contact CTA

### Contact/Conversion
- `ContactHero` — contact page hero
- `InquiryTypeSelector` — category selection
- `ContactForm` — full form with validation
- `ContactInfoPanel` — email, WhatsApp, social
- `ContactSuccessState` — post-submission state

### Motion
- `FadeIn` — opacity entrance
- `RevealUp` — slide-up reveal
- `StaggerGroup` — staggered children animation
- `HoverLift` — card hover effect
- `SectionTransition` — section-level scroll animation

---

## 13. Build Plan

### Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- lucide-react (icons)

### Implementation Sequence
1. Project initialization + Tailwind + Framer Motion setup
2. Design system tokens in Tailwind config
3. Bilingual content architecture (`/content/`)
4. i18n middleware + locale routing
5. Layout components (Header, Footer, LanguageSwitch)
6. Motion helpers
7. Shared UI components
8. Homepage (all sections)
9. About page
10. Services overview + 3 individual service pages
11. Insights/Journal page
12. Contact page with form + attribution
13. Analytics/tracking infrastructure
14. SEO metadata + structured data
15. Favicon + app icons
16. Responsive polish
17. Documentation
