import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Document Verification - SAIKI Group',
  description: 'Verify the authenticity of documents, invoices, and receipts issued by SAIKI Group.',
  robots: 'noindex, nofollow',
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
