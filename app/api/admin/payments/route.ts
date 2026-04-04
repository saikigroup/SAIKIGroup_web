import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

function checkAuth(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get('invoice_id');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from(TABLES.PAYMENTS)
    .select('*', { count: 'exact' })
    .order('saikiweb_created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (invoiceId) {
    query = query.eq('saikiweb_invoice_id', invoiceId);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
  });
}

export async function POST(request: NextRequest) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();

    const { data: payment, error } = await supabase
      .from(TABLES.PAYMENTS)
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Payment insert error:', error);
      return NextResponse.json({ success: false, error: 'Failed to record payment' }, { status: 500 });
    }

    // Update invoice status based on total payments
    if (body.saikiweb_invoice_id && body.saikiweb_status === 'confirmed') {
      const { data: invoice } = await supabase
        .from(TABLES.INVOICES)
        .select('saikiweb_grand_total')
        .eq('saikiweb_invoice_id', body.saikiweb_invoice_id)
        .single();

      const { data: payments } = await supabase
        .from(TABLES.PAYMENTS)
        .select('saikiweb_amount')
        .eq('saikiweb_invoice_id', body.saikiweb_invoice_id)
        .eq('saikiweb_status', 'confirmed');

      if (invoice && payments) {
        const totalPaid = payments.reduce((sum: number, p: { saikiweb_amount: number }) => sum + p.saikiweb_amount, 0);
        const newStatus = totalPaid >= invoice.saikiweb_grand_total ? 'paid' : 'partial';

        await supabase
          .from(TABLES.INVOICES)
          .update({ saikiweb_status: newStatus, saikiweb_updated_at: new Date().toISOString() })
          .eq('saikiweb_invoice_id', body.saikiweb_invoice_id);
      }
    }

    return NextResponse.json({ success: true, data: payment });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
