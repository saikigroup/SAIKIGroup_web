import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token || token.length < 20) {
    return NextResponse.json({ success: false, error: 'Invalid verification token' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Service unavailable' }, { status: 500 });
  }

  const { data: invoice, error } = await supabase
    .from(TABLES.INVOICES)
    .select('saikiweb_invoice_number, saikiweb_service_brand, saikiweb_status, saikiweb_client_name, saikiweb_issued_date, saikiweb_grand_total, saikiweb_currency')
    .eq('saikiweb_verification_token', token)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
  }

  // Only return limited data for public verification
  return NextResponse.json({
    success: true,
    data: {
      invoice_number: invoice.saikiweb_invoice_number,
      service_brand: invoice.saikiweb_service_brand,
      status: invoice.saikiweb_status,
      client_name: invoice.saikiweb_client_name,
      issued_date: invoice.saikiweb_issued_date,
      grand_total: invoice.saikiweb_grand_total,
      currency: invoice.saikiweb_currency,
    },
  });
}
