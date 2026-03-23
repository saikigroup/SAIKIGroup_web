'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const content = {
  id: {
    successTitle: 'Berhasil Berhenti Berlangganan',
    successBody: 'Email kamu sudah dihapus dari daftar penerima insight SAIKI.',
    successNote: 'Kamu tidak akan menerima email dari kami lagi. Jika ini tidak disengaja, silakan hubungi kami.',
    errorTitle: 'Terjadi Kesalahan',
    errorBody: 'Maaf, kami tidak bisa memproses permintaan kamu. Link mungkin sudah kedaluwarsa atau tidak valid. Silakan hubungi kami jika masalah berlanjut.',
    back: 'Kembali ke Beranda',
  },
  en: {
    successTitle: 'Successfully Unsubscribed',
    successBody: 'Your email has been removed from the SAIKI insight mailing list.',
    successNote: 'You will no longer receive emails from us. If this was unintentional, please contact us.',
    errorTitle: 'Something Went Wrong',
    errorBody: 'Sorry, we could not process your request. The link may have expired or is invalid. Please contact us if the issue persists.',
    back: 'Back to Home',
  },
};

function UnsubscribeContent() {
  const params = useSearchParams();
  const { locale } = useParams<{ locale: string }>();
  const status = params.get('status');
  const isSuccess = status === 'success';
  const t = content[locale as keyof typeof content] || content.id;

  return (
    <section className="py-20 md:py-32 min-h-[60vh] flex items-center">
      <div className="container-editorial text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${isSuccess ? 'bg-gradient-teal shadow-brand-teal/30' : 'bg-red-500 shadow-red-500/30'}`}>
          {isSuccess ? (
            <CheckCircle className="w-8 h-8 text-white" />
          ) : (
            <XCircle className="w-8 h-8 text-white" />
          )}
        </div>

        {isSuccess ? (
          <>
            <h1 className="heading-sans text-2xl md:text-3xl text-brand-black mb-4">
              {t.successTitle}
            </h1>
            <p className="text-text-secondary max-w-md mx-auto mb-2">
              {t.successBody}
            </p>
            <p className="text-text-muted text-sm max-w-md mx-auto">
              {t.successNote}
            </p>
          </>
        ) : (
          <>
            <h1 className="heading-sans text-2xl md:text-3xl text-brand-black mb-4">
              {t.errorTitle}
            </h1>
            <p className="text-text-secondary max-w-md mx-auto">
              {t.errorBody}
            </p>
          </>
        )}

        <div className="mt-10">
          <a
            href={`/${locale || 'id'}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-teal to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-teal/25 transition-all"
          >
            {t.back}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-text-muted">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
