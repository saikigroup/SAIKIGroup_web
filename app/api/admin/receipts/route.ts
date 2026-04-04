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
  const search = searchParams.get('search');
  const offset = (page - 1) * limit;

  let query = supabase
    .from(TABLES.RECEIPTS)
    .select('*', { count: 'exact' })
    .order('saikiweb_created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    const s = search.replace(/[%_\\]/g, '\\$&');
    query = query.or(
      `saikiweb_client_name.ilike.%${s}%,saikiweb_receipt_number.ilike.%${s}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch receipts' }, { status: 500 });
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

    body.saikiweb_verification_token = generateVerificationToken();

    // Auto-set stamp status: receipts >= 5,000,000 IDR need e-meterai
    const amount = body.saikiweb_amount || 0;
    const currency = body.saikiweb_currency || 'IDR';
    if (currency === 'IDR' && amount >= 5000000) {
      body.saikiweb_stamp_status = 'needs_stamp';
    } else {
      body.saikiweb_stamp_status = 'not_required';
    }

    const { data, error } = await supabase
      .from(TABLES.RECEIPTS)
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Receipt insert error:', error);
      return NextResponse.json({ success: false, error: 'Failed to create receipt' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
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
    const { saikiweb_receipt_id, ...updateData } = body;

    if (!saikiweb_receipt_id) {
      return NextResponse.json({ success: false, error: 'Receipt ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(TABLES.RECEIPTS)
      .update(updateData)
      .eq('saikiweb_receipt_id', saikiweb_receipt_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to update receipt' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
