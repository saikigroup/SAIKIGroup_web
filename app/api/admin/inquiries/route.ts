import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'Supabase not configured. Check SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const offset = (page - 1) * limit;

  let query = supabase
    .from(TABLES.INQUIRIES)
    .select('*', { count: 'exact' })
    .order('saikiweb_created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== 'all') {
    query = query.eq('saikiweb_category', category);
  }

  if (search) {
    const s = search.replace(/[%_\\]/g, '\\$&');
    query = query.or(
      `saikiweb_name.ilike.%${s}%,saikiweb_email.ilike.%${s}%,saikiweb_company.ilike.%${s}%,saikiweb_message.ilike.%${s}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase query error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}
