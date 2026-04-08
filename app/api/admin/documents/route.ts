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
  const docType = searchParams.get('type');
  const search = searchParams.get('search');
  const offset = (page - 1) * limit;

  let query = supabase
    .from(TABLES.DOCUMENTS)
    .select('*', { count: 'exact' })
    .order('saikiweb_created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== 'all') {
    query = query.eq('saikiweb_status', status);
  }
  if (brand && brand !== 'all') {
    query = query.eq('saikiweb_service_brand', brand);
  }
  if (docType && docType !== 'all') {
    query = query.eq('saikiweb_document_type', docType);
  }
  if (search) {
    const s = search.replace(/[%_\\]/g, '\\$&');
    query = query.or(
      `saikiweb_document_name.ilike.%${s}%,saikiweb_document_number.ilike.%${s}%,saikiweb_issued_to.ilike.%${s}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Documents fetch error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch documents' }, { status: 500 });
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

    // Generate verification token
    body.saikiweb_verification_token = generateVerificationToken();

    // Clean empty strings to null for optional fields
    const nullableFields = [
      'saikiweb_description', 'saikiweb_signer_name', 'saikiweb_signer_title',
      'saikiweb_valid_until', 'saikiweb_original_file_url', 'saikiweb_stamped_file_url',
      'saikiweb_notes',
    ];
    for (const field of nullableFields) {
      if (body[field] === '' || body[field] === undefined) {
        body[field] = null;
      }
    }

    const { data, error } = await supabase
      .from(TABLES.DOCUMENTS)
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Document insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Document POST error:', err);
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
    const { saikiweb_document_id, ...updateData } = body;

    if (!saikiweb_document_id) {
      return NextResponse.json({ success: false, error: 'Document ID required' }, { status: 400 });
    }

    // Clean empty strings to null for optional fields
    const nullableFields = [
      'saikiweb_description', 'saikiweb_signer_name', 'saikiweb_signer_title',
      'saikiweb_valid_until', 'saikiweb_original_file_url', 'saikiweb_stamped_file_url',
      'saikiweb_notes',
    ];
    for (const field of nullableFields) {
      if (field in updateData && (updateData[field] === '' || updateData[field] === undefined)) {
        updateData[field] = null;
      }
    }

    updateData.saikiweb_updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(TABLES.DOCUMENTS)
      .update(updateData)
      .eq('saikiweb_document_id', saikiweb_document_id)
      .select()
      .single();

    if (error) {
      console.error('Document update error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Document PUT error:', err);
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
    return NextResponse.json({ success: false, error: 'Document ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from(TABLES.DOCUMENTS)
    .delete()
    .eq('saikiweb_document_id', id);

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete document' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
