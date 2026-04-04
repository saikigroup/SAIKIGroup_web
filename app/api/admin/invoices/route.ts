import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';
import { generateVerificationToken } from '@/lib/finance';

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
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const status = searchParams.get('status');
  const brand = searchParams.get('brand');
  const search = searchParams.get('search');
  const offset = (page - 1) * limit;

  let query = supabase
    .from(TABLES.INVOICES)
    .select('*', { count: 'exact' })
    .order('saikiweb_created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== 'all') {
    query = query.eq('saikiweb_status', status);
  }
  if (brand && brand !== 'all') {
    query = query.eq('saikiweb_service_brand', brand);
  }
  if (search) {
    const s = search.replace(/[%_\\]/g, '\\$&');
    query = query.or(
      `saikiweb_client_name.ilike.%${s}%,saikiweb_invoice_number.ilike.%${s}%,saikiweb_client_email.ilike.%${s}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch invoices' }, { status: 500 });
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
    const { items, ...invoiceData } = body;

    // Generate verification token
    invoiceData.saikiweb_verification_token = generateVerificationToken();

    // Calculate totals from items
    let subtotal = 0;
    if (items && items.length > 0) {
      subtotal = items.reduce((sum: number, item: { quantity: number; unit_price: number }) =>
        sum + (item.quantity * item.unit_price), 0);
    }

    const taxAmount = invoiceData.saikiweb_tax_percent
      ? subtotal * (invoiceData.saikiweb_tax_percent / 100)
      : 0;
    const discountAmount = invoiceData.saikiweb_discount_amount || 0;

    invoiceData.saikiweb_subtotal = subtotal;
    invoiceData.saikiweb_tax_amount = taxAmount;
    invoiceData.saikiweb_grand_total = subtotal + taxAmount - discountAmount;

    // Insert invoice
    const { data: invoice, error: invoiceErr } = await supabase
      .from(TABLES.INVOICES)
      .insert(invoiceData)
      .select()
      .single();

    if (invoiceErr) {
      console.error('Invoice insert error:', invoiceErr);
      return NextResponse.json({ success: false, error: 'Failed to create invoice' }, { status: 500 });
    }

    // Insert items
    if (items && items.length > 0) {
      const itemRows = items.map((item: { description: string; quantity: number; unit_price: number }, idx: number) => ({
        saikiweb_invoice_id: invoice.saikiweb_invoice_id,
        saikiweb_description: item.description,
        saikiweb_quantity: item.quantity,
        saikiweb_unit_price: item.unit_price,
        saikiweb_subtotal: item.quantity * item.unit_price,
        saikiweb_sort_order: idx,
      }));

      const { error: itemsErr } = await supabase.from(TABLES.INVOICE_ITEMS).insert(itemRows);
      if (itemsErr) {
        console.error('Items insert error:', itemsErr);
      }
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { saikiweb_invoice_id, items, ...updateData } = body;

    if (!saikiweb_invoice_id) {
      return NextResponse.json({ success: false, error: 'Invoice ID required' }, { status: 400 });
    }

    // Recalculate totals if items are provided
    if (items && items.length > 0) {
      const subtotal = items.reduce((sum: number, item: { quantity: number; unit_price: number }) =>
        sum + (item.quantity * item.unit_price), 0);
      const taxAmount = updateData.saikiweb_tax_percent
        ? subtotal * (updateData.saikiweb_tax_percent / 100)
        : 0;
      const discountAmount = updateData.saikiweb_discount_amount || 0;

      updateData.saikiweb_subtotal = subtotal;
      updateData.saikiweb_tax_amount = taxAmount;
      updateData.saikiweb_grand_total = subtotal + taxAmount - discountAmount;

      // Delete old items and insert new
      await supabase.from(TABLES.INVOICE_ITEMS).delete().eq('saikiweb_invoice_id', saikiweb_invoice_id);

      const itemRows = items.map((item: { description: string; quantity: number; unit_price: number }, idx: number) => ({
        saikiweb_invoice_id,
        saikiweb_description: item.description,
        saikiweb_quantity: item.quantity,
        saikiweb_unit_price: item.unit_price,
        saikiweb_subtotal: item.quantity * item.unit_price,
        saikiweb_sort_order: idx,
      }));

      await supabase.from(TABLES.INVOICE_ITEMS).insert(itemRows);
    }

    updateData.saikiweb_updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(TABLES.INVOICES)
      .update(updateData)
      .eq('saikiweb_invoice_id', saikiweb_invoice_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to update invoice' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const authErr = checkAuth(request);
  if (authErr) return authErr;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Invoice ID required' }, { status: 400 });
  }

  // Delete items first
  await supabase.from(TABLES.INVOICE_ITEMS).delete().eq('saikiweb_invoice_id', id);

  const { error } = await supabase
    .from(TABLES.INVOICES)
    .delete()
    .eq('saikiweb_invoice_id', id);

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete invoice' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
