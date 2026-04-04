import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get('invoice_id');

  if (!invoiceId) {
    return NextResponse.json({ success: false, error: 'Invoice ID required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(TABLES.INVOICE_ITEMS)
    .select('*')
    .eq('saikiweb_invoice_id', invoiceId)
    .order('saikiweb_sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
