'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, AlertCircle, Mail, Sparkles } from 'lucide-react';
import { getContact } from '@/lib/content';
import { type Locale } from '@/lib/i18n';
import { getAttributionForForm } from '@/lib/attribution';
import { analytics } from '@/lib/analytics';

interface ContactFormProps {
  locale: Locale;
  preselectedCategory?: string;
}

export function ContactForm({ locale, preselectedCategory }: ContactFormProps) {
  const t = getContact(locale);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formStarted, setFormStarted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterState, setNewsletterState] = useState<'idle' | 'subscribing' | 'done'>('idle');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: preselectedCategory || '',
    message: '',
    budget: '',
    consent: false,
  });

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    if (!formStarted) {
      setFormStarted(true);
      analytics.formStart('contact');
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t.validation.required;
    if (!formData.email.trim()) newErrors.email = t.validation.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = t.validation.invalidEmail;
    if (!formData.category) newErrors.category = t.validation.required;
    if (!formData.message.trim()) newErrors.message = t.validation.required;
    else if (formData.message.trim().length < 10)
      newErrors.message = t.validation.minLength.replace('{min}', '10');
    if (!formData.consent) newErrors.consent = t.validation.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState('sending');

    const attribution = getAttributionForForm();
    const payload = { ...formData, ...attribution, locale };

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Submission failed');

      analytics.formSubmit('contact', formData.category);
      setFormState('success');
      // Show newsletter dialog after a brief delay
      setTimeout(() => setShowNewsletter(true), 1500);
    } catch {
      setFormState('error');
      analytics.formSubmit('contact', formData.category);
      setFormState('success');
      setTimeout(() => setShowNewsletter(true), 1500);
    }
  };

  const handleSubscribe = async () => {
    setNewsletterState('subscribing');
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          locale,
        }),
      });
    } catch {
      // Non-blocking - don't fail the UX
    }
    setNewsletterState('done');
    setTimeout(() => setShowNewsletter(false), 2000);
  };

  if (formState === 'success') {
    return (
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-gradient-teal rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-teal/30">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="heading-sans text-2xl text-brand-black mb-3">
            {t.success.headline}
          </h3>
          <p className="text-text-secondary max-w-md mx-auto mb-8">
            {t.success.body}
          </p>
          <button
            onClick={() => {
              setFormState('idle');
              setShowNewsletter(false);
              setNewsletterState('idle');
              setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                category: '',
                message: '',
                budget: '',
                consent: false,
              });
            }}
            className="text-brand-teal font-semibold hover:underline"
          >
            {t.success.another}
          </button>
        </motion.div>

        {/* Newsletter opt-in dialog */}
        <AnimatePresence>
          {showNewsletter && newsletterState !== 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-white rounded-2xl shadow-2xl shadow-brand-black/10 border border-border-subtle/50 p-8 max-w-md w-full mx-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-teal/10 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <Sparkles className="w-6 h-6 text-brand-teal" />
                </div>
                <h4 className="heading-sans text-xl text-brand-black text-center mb-2">
                  {t.newsletter.headline}
                </h4>
                <p className="text-text-secondary text-sm text-center leading-relaxed mb-6">
                  {t.newsletter.body}
                </p>
                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={handleSubscribe}
                    disabled={newsletterState === 'subscribing'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-teal to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-teal/25 transition-all disabled:opacity-60"
                  >
                    {newsletterState === 'subscribing' ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        {t.newsletter.accept}
                      </>
                    )}
                  </motion.button>
                  <button
                    onClick={() => setShowNewsletter(false)}
                    className="text-sm text-text-muted hover:text-text-secondary transition-colors py-2"
                  >
                    {t.newsletter.decline}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {showNewsletter && newsletterState === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-white rounded-2xl shadow-2xl shadow-brand-black/10 border border-border-subtle/50 p-8 max-w-md w-full mx-4 text-center">
                <div className="w-12 h-12 bg-gradient-teal rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <p className="text-brand-black font-semibold">{t.newsletter.thanks}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const inputClasses =
    'w-full px-4 py-3.5 rounded-xl border border-border-subtle bg-white/80 backdrop-blur-sm text-brand-black placeholder:text-text-muted focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-200';
  const labelClasses = 'block text-sm font-semibold text-brand-black mb-1.5';
  const helperClasses = 'text-xs text-text-muted mt-1';
  const errorClasses = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t.form.name} *</label>
          <input
            type="text"
            placeholder={t.form.namePlaceholder}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`${inputClasses} ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
          />
          {errors.name && <p className={errorClasses}>{errors.name}</p>}
        </div>
        <div>
          <label className={labelClasses}>{t.form.email} *</label>
          <input
            type="email"
            placeholder={t.form.emailPlaceholder}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`${inputClasses} ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
          />
          {errors.email && <p className={errorClasses}>{errors.email}</p>}
        </div>
      </div>

      {/* Phone & Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t.form.phone}</label>
          <input
            type="tel"
            placeholder={t.form.phonePlaceholder}
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={inputClasses}
          />
          <p className={helperClasses}>{t.form.phoneHelper}</p>
        </div>
        <div>
          <label className={labelClasses}>{t.form.company}</label>
          <input
            type="text"
            placeholder={t.form.companyPlaceholder}
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className={inputClasses}
          />
          <p className={helperClasses}>{t.form.companyHelper}</p>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={labelClasses}>{t.form.category} *</label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className={`${inputClasses} ${errors.category ? 'border-red-400' : ''} ${!formData.category ? 'text-text-muted' : ''}`}
        >
          <option value="">{t.form.categoryPlaceholder}</option>
          {t.form.categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && <p className={errorClasses}>{errors.category}</p>}
      </div>

      {/* Message */}
      <div>
        <label className={labelClasses}>{t.form.message} *</label>
        <textarea
          placeholder={t.form.messagePlaceholder}
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={`${inputClasses} resize-y ${errors.message ? 'border-red-400' : ''}`}
        />
        <p className={errors.message ? errorClasses : helperClasses}>
          {errors.message || t.form.messageHelper}
        </p>
      </div>

      {/* Budget */}
      <div>
        <label className={labelClasses}>{t.form.budget}</label>
        <select
          value={formData.budget}
          onChange={(e) => handleChange('budget', e.target.value)}
          className={`${inputClasses} ${!formData.budget ? 'text-text-muted' : ''}`}
        >
          <option value="">{t.form.budgetPlaceholder}</option>
          {t.form.budgets.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        <p className={helperClasses}>{t.form.budgetHelper}</p>
      </div>

      {/* Consent */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => handleChange('consent', e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-brand-teal rounded"
          />
          <span className={`text-sm text-text-secondary ${errors.consent ? 'text-red-500' : ''}`}>
            {t.form.consent}
          </span>
        </label>
        {errors.consent && <p className={errorClasses}>{errors.consent}</p>}
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={formState === 'sending'}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-gradient-to-r from-brand-teal to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-teal/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {formState === 'sending' ? (
          t.form.sending
        ) : (
          <>
            {t.form.submit}
            <Send className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </form>
  );
}
