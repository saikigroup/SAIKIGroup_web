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
