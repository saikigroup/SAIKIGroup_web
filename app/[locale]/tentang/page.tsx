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

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-surface-cream">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <FadeIn>
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              <h1 className="heading-editorial text-5xl md:text-6xl lg:text-7xl text-brand-black mt-4 whitespace-pre-line">
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
      <section className="py-20 md:py-32 bg-white">
        <div className="container-editorial">
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
                <p className="text-lg text-text-secondary leading-relaxed">
                  {t.story.body2}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 bg-surface-light">
        <div className="container-editorial">
          <FadeIn>
            <SectionHeading eyebrow={t.values.eyebrow} headline={t.values.headline} />
          </FadeIn>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
            {t.values.items.map((item, i) => (
              <StaggerItem key={i}>
                <div className="border-l-2 border-brand-teal pl-6 md:pl-8">
                  <span className="eyebrow text-brand-grey">0{i + 1}</span>
                  <h3 className="heading-sans text-xl text-brand-black mt-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container-editorial max-w-3xl">
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
