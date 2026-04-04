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

  const { data: receipt, error } = await supabase
    .from(TABLES.RECEIPTS)
    .select('saikiweb_receipt_number, saikiweb_service_brand, saikiweb_client_name, saikiweb_amount, saikiweb_currency, saikiweb_receipt_date, saikiweb_payment_for, saikiweb_reference_docs')
    .eq('saikiweb_verification_token', token)
    .single();

  if (error || !receipt) {
    return NextResponse.json({ success: false, error: 'Receipt not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      receipt_number: receipt.saikiweb_receipt_number,
      service_brand: receipt.saikiweb_service_brand,
      client_name: receipt.saikiweb_client_name,
      amount: receipt.saikiweb_amount,
      currency: receipt.saikiweb_currency,
      receipt_date: receipt.saikiweb_receipt_date,
      payment_for: receipt.saikiweb_payment_for,
      reference_docs: receipt.saikiweb_reference_docs || [],
    },
  });
}
