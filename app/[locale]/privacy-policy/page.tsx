import { type Locale } from '@/lib/i18n';
import { generatePageMetadata } from '@/lib/metadata';
import { getLegal } from '@/lib/content';
import { FadeIn } from '@/components/motion';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('privacy', locale as Locale);
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const t = getLegal(locale).privacy;

  return (
    <section className="py-20 md:py-32">
      <div className="container-editorial max-w-3xl">
        <FadeIn>
          <h1 className="heading-sans text-3xl md:text-4xl text-brand-black mb-3">
            {t.title}
          </h1>
          <p className="text-text-muted text-sm mb-8">{t.lastUpdated}</p>
          <p className="text-text-secondary leading-relaxed mb-10">{t.intro}</p>

          <div className="space-y-8">
            {t.sections.map((section, i) => (
              <div key={i}>
                <h2 className="heading-sans text-xl text-brand-black mb-3">
                  {section.heading}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="mt-3 space-y-2">
                    {section.list.map((item, j) => (
                      <li key={j} className="text-text-secondary leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-brand-teal">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
