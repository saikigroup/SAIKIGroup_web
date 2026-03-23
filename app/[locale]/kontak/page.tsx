import { type Locale } from '@/lib/i18n';
import { getContact } from '@/lib/content';
import { generatePageMetadata } from '@/lib/metadata';
import { FadeIn } from '@/components/motion';
import { Eyebrow } from '@/components/shared';
import { ContactForm } from '@/components/forms/ContactForm';
import { buildWhatsAppURL } from '@/lib/phone';
import { Mail, MessageCircle, MapPin, Clock } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata('contact', locale as Locale);
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  const locale = l as Locale;
  const t = getContact(locale);

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32 bg-mesh relative overflow-hidden">
        <div className="absolute top-20 -right-32 w-48 h-48 md:w-96 md:h-96 bg-brand-teal/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-40 h-40 md:w-80 md:h-80 bg-brand-coral/10 rounded-full blur-3xl" />

        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <FadeIn>
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              <h1 className="heading-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-brand-black mt-4">
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

      {/* Form + Info */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-brand-violet/5 rounded-full blur-3xl" />

        <div className="container-editorial relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7">
              <FadeIn>
                <ContactForm locale={locale} />
              </FadeIn>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-4 lg:col-start-9">
              <FadeIn delay={0.2}>
                <div className="sticky top-28 space-y-6">
                  <div className="glass-strong rounded-2xl p-6">
                    <h3 className="heading-sans text-lg text-brand-black mb-5">
                      {t.info.headline}
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-brand-teal" />
                        </div>
                        <p className="text-sm text-text-secondary italic leading-relaxed pt-1.5">
                          {t.info.address}
                        </p>
                      </div>

                      <a
                        href={`mailto:${t.info.email}`}
                        className="flex items-center gap-3 text-sm text-text-secondary hover:text-brand-teal transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0 group-hover:bg-brand-teal/20 transition-colors">
                          <Mail className="w-4 h-4 text-brand-teal" />
                        </div>
                        {t.info.email}
                      </a>

                      <a
                        href={buildWhatsAppURL(t.info.phone) || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl px-4 py-3 transition-colors group"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {t.info.whatsapp}
                      </a>
                    </div>
                  </div>

                  {/* Response time */}
                  <div className="glass-strong rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-brand-coral/10 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-brand-coral" />
                      </div>
                      <h4 className="text-sm font-semibold text-brand-black">
                        {t.info.response}
                      </h4>
                    </div>
                    <p className="text-sm text-text-secondary pl-12">
                      {t.info.responseTime}
                    </p>
                  </div>

                  {/* Process */}
                  <div className="glass-strong rounded-2xl p-6">
                    <h4 className="text-sm font-semibold text-brand-black mb-4">
                      {t.info.process}
                    </h4>
                    <ol className="space-y-3">
                      {t.info.processSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-7 h-7 bg-gradient-teal rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-text-secondary pt-0.5">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
