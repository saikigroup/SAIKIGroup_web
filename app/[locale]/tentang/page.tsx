import { type Locale } from '@/lib/i18n';
import { getAbout, getHome } from '@/lib/content';
import { generatePageMetadata } from '@/lib/metadata';
import { FadeIn, StaggerGroup, StaggerItem } from '@/components/motion';
import { SectionHeading, Eyebrow, CTAButton } from '@/components/shared';
import { ContactCTA } from '@/components/sections';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('about', locale as Locale);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const t = getAbout(locale);
  const homeT = getHome(locale);

  const valueColors = ['#0d9488', '#8b5cf6', '#f97316', '#f43f5e'];

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-brand-violet/10 rounded-full blur-3xl" />

        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <FadeIn>
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-brand-black mt-4 whitespace-pre-line">
                {t.hero.headline}
              </h1>
              <div className="editorial-divider-bold w-20 mt-8" />
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mt-8">
                {t.hero.body}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-coral/5 rounded-full blur-3xl" />

        <div className="container-editorial relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <FadeIn>
                <SectionHeading eyebrow={t.story.eyebrow} headline={t.story.headline} />
              </FadeIn>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <FadeIn delay={0.2}>
                <div className="editorial-divider-bold w-16 mb-8" />
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  {t.story.body}
                </p>
                <p className="text-lg text-brand-black font-medium leading-relaxed glass rounded-xl p-6">
                  {t.story.body2}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 bg-gradient-cool relative overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl" />

        <div className="container-editorial relative">
          <FadeIn>
            <SectionHeading eyebrow={t.values.eyebrow} headline={t.values.headline} />
          </FadeIn>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
            {t.values.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="glass-strong rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: valueColors[i % valueColors.length] }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="heading-sans text-xl text-brand-black">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed pl-11">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="container-editorial max-w-3xl relative">
          <FadeIn>
            <SectionHeading
              eyebrow={t.approach.eyebrow}
              headline={t.approach.headline}
              body={t.approach.body}
              align="center"
            />
          </FadeIn>
        </div>
      </section>

      <ContactCTA
        eyebrow={homeT.contactCta.eyebrow}
        headline={homeT.contactCta.headline}
        body={homeT.contactCta.body}
        cta={homeT.contactCta.cta}
        locale={locale}
      />
    </>
  );
}
