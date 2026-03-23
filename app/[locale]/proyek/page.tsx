import { type Locale } from '@/lib/i18n';
import { getProjects } from '@/lib/content';
import { generatePageMetadata } from '@/lib/metadata';
import { FadeIn } from '@/components/motion';
import { Eyebrow } from '@/components/shared';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { AnimatedCounter } from '@/components/interactive/AnimatedCounter';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('projects', locale as Locale);
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const t = getProjects(locale);

  const imageryCount = t.items.filter((i) => i.category === 'imagery').length;
  const techCount = t.items.filter((i) => i.category === 'technology').length;
  const consultancyCount = t.items.filter((i) => i.category === 'consultancy').length;

  const stats = locale === 'id'
    ? [
        { value: t.items.length, label: 'Project Selesai' },
        { value: imageryCount, label: 'Imagery' },
        { value: techCount, label: 'Technology' },
        { value: consultancyCount, label: 'Consultancy' },
      ]
    : [
        { value: t.items.length, label: 'Projects Delivered' },
        { value: imageryCount, label: 'Imagery' },
        { value: techCount, label: 'Technology' },
        { value: consultancyCount, label: 'Consultancy' },
      ];

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-violet/10 rounded-full blur-3xl" />

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

          {/* Stats row */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 pt-10 border-t border-border-subtle/50">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="heading-display text-3xl md:text-4xl text-brand-teal">
                    <AnimatedCounter value={String(stat.value)} />+
                  </div>
                  <p className="text-sm text-text-muted mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Project grid with filter */}
      <section className="py-20 md:py-32 bg-gradient-cool relative overflow-hidden">
        <div className="container-editorial relative">
          <ProjectGrid
            items={t.items}
            filterLabels={t.filter}
            locale={locale}
          />
        </div>
      </section>

      {/* CTA */}
      <ContactCTA
        eyebrow={t.cta.eyebrow}
        headline={t.cta.headline}
        body={t.cta.body}
        cta={t.cta.button}
        locale={locale}
      />
    </>
  );
}
