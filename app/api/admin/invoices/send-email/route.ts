import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';
import { sendFinanceEmail } from '@/lib/email';
import type { FinanceEmailData } from '@/lib/email';

export async function POST(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      to,
      subject,
      emailBody,
      closingMessage,
      serviceBrand,
      clientName,
      paymentReferences,
      amounts,
      attachedDocsList,
      invoiceId,
      receiptId,
    } = body;

    if (!to || !subject || !emailBody) {
      return NextResponse.json({ success: false, error: 'Missing required fields: to, subject, emailBody' }, { status: 400 });
    }

    // Fetch file URLs for attachments
    const attachments: { filename: string; path?: string; href?: string }[] = [];

    // Attach invoice PDF if uploaded
    if (invoiceId) {
      const { data: inv } = await supabase
        .from(TABLES.INVOICES)
        .select('saikiweb_invoice_number, saikiweb_signed_file_url')
        .eq('saikiweb_invoice_id', invoiceId)
        .single();

      if (inv?.saikiweb_signed_file_url) {
        attachments.push({
          filename: `${inv.saikiweb_invoice_number}.pdf`,
          href: inv.saikiweb_signed_file_url,
        });
      }
    }

    // Attach receipt stamped PDF if available
    if (receiptId) {
      const { data: receipt } = await supabase
        .from(TABLES.RECEIPTS)
        .select('saikiweb_receipt_number, saikiweb_stamp_status, saikiweb_stamped_file_url')
        .eq('saikiweb_receipt_id', receiptId)
        .single();

      if (receipt?.saikiweb_stamped_file_url && receipt.saikiweb_stamp_status === 'stamped') {
        attachments.push({
          filename: `${receipt.saikiweb_receipt_number}_stamped.pdf`,
          href: receipt.saikiweb_stamped_file_url,
        });
      }
    }

    const emailData: FinanceEmailData = {
      to,
      subject,
      clientName: clientName || '',
      serviceBrand: serviceBrand || 'consultancy',
      emailBody,
      closingMessage,
      paymentReferences,
      amounts,
      attachedDocsList,
      attachments: attachments.length > 0
        ? attachments.map((a) => ({ filename: a.filename, href: a.href }))
        : undefined,
    };

    await sendFinanceEmail(emailData);

    // Update sent_at timestamps
    const now = new Date().toISOString();

    if (invoiceId) {
      await supabase
        .from(TABLES.INVOICES)
        .update({ saikiweb_sent_at: now, saikiweb_status: 'sent', saikiweb_updated_at: now })
        .eq('saikiweb_invoice_id', invoiceId)
        .in('saikiweb_status', ['draft']);
    }

    if (receiptId) {
      await supabase
        .from(TABLES.RECEIPTS)
        .update({ saikiweb_sent_at: now })
        .eq('saikiweb_receipt_id', receiptId);
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Failed to send finance email:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
