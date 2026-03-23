import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Building2, Calendar, Clock } from 'lucide-react';
import { type Locale, getLocalizedPath } from '@/lib/i18n';
import { getProjectDetail, getAllProjectSlugs } from '@/content/projects';
import { FadeIn } from '@/components/motion';
import { Eyebrow, ServiceTag } from '@/components/shared';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { ProjectDetailRenderer } from '@/components/sections/ProjectDetailRenderer';
import { getProjects } from '@/lib/content';
import type { ServiceKey } from '@/lib/utils';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  const params: Array<{ locale: string; slug: string }> = [];
  for (const slug of slugs) {
    params.push({ locale: 'id', slug });
    params.push({ locale: 'en', slug });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectDetail(slug, locale as Locale);
  if (!project) return {};
  return {
    title: `${project.title} | SAIKI Group`,
    description: project.overview,
  };
}

const categoryGradients: Record<string, string> = {
  imagery: 'from-cyan-600 via-teal-600 to-emerald-600',
  technology: 'from-violet-600 via-purple-600 to-fuchsia-600',
  consultancy: 'from-rose-600 via-pink-600 to-orange-600',
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const project = getProjectDetail(slug, locale);

  if (!project) {
    notFound();
  }

  const t = getProjects(locale);
  const ctaLabels = t.cta;

  // Build "back to projects" label
  const backLabel = locale === 'id' ? 'Kembali ke Proyek' : 'Back to Projects';
  const projectsPath = getLocalizedPath('projects', locale);

  // Get next project info
  const nextProject = project.nextProject;
  const nextProjectPath = nextProject
    ? `/${locale}/${locale === 'id' ? 'proyek' : 'projects'}/${nextProject.slug}`
    : null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[project.category]} opacity-5`} />
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-teal/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-violet/8 rounded-full blur-3xl" />

        <div className="container-editorial pt-28 md:pt-36 pb-16 md:pb-24 relative">
          {/* Back link */}
          <FadeIn>
            <Link
              href={projectsPath}
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-teal transition-colors mb-10"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>
          </FadeIn>

          <div className="max-w-4xl">
            <FadeIn>
              <ServiceTag
                service={project.category as ServiceKey}
                label={project.category.charAt(0).toUpperCase() + project.category.slice(1)}
              />

              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-brand-black mt-6">
                {project.title}
              </h1>

              {project.subtitle && (
                <p className="text-xl md:text-2xl text-text-secondary mt-4 leading-relaxed">
                  {project.subtitle}
                </p>
              )}
            </FadeIn>

            {/* Meta info */}
            <FadeIn delay={0.15}>
              <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-border-subtle/50">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Building2 className="w-4 h-4 text-text-muted" />
                  <span className="font-medium">{project.industry}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Calendar className="w-4 h-4 text-text-muted" />
                  <span>{project.year}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span>{project.duration}</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 md:py-16 bg-surface-cream">
        <div className="container-editorial max-w-3xl mx-auto">
          <FadeIn>
            <Eyebrow>{locale === 'id' ? 'Ringkasan' : 'Overview'}</Eyebrow>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mt-4">
              {project.overview}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Dynamic sections */}
      <ProjectDetailRenderer sections={project.sections} />

      {/* Outcome */}
      <section className="py-16 md:py-24 bg-surface-light">
        <div className="container-editorial max-w-3xl mx-auto">
          <FadeIn>
            <Eyebrow color="text-brand-teal">{locale === 'id' ? 'Hasil' : 'Outcome'}</Eyebrow>
            <h2 className="heading-sans text-2xl md:text-3xl text-brand-black mt-4 mb-6">
              {project.outcome.heading}
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              {project.outcome.body}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Next project */}
      {nextProject && nextProjectPath && (
        <section className="py-12 border-t border-border-subtle/50">
          <div className="container-editorial">
            <FadeIn>
              <Link
                href={nextProjectPath}
                className="group flex items-center justify-between py-6 hover:opacity-80 transition-opacity"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
                    {locale === 'id' ? 'Project Berikutnya' : 'Next Project'}
                  </p>
                  <h3 className="heading-sans text-xl md:text-2xl text-brand-black group-hover:text-brand-teal transition-colors">
                    {nextProject.title}
                  </h3>
                </div>
                <ArrowRight className="w-6 h-6 text-text-muted group-hover:text-brand-teal transition-colors" />
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* CTA */}
      <ContactCTA
        eyebrow={ctaLabels.eyebrow}
        headline={ctaLabels.headline}
        body={ctaLabels.body}
        cta={ctaLabels.button}
        locale={locale}
      />
    </>
  );
}
