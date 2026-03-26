import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

function authorize(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  return adminPassword && password === adminPassword;
}

function getSupabaseOrFail() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }
  return supabase;
}

// GET: List articles with optional filters
export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseOrFail();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'all';
  const published = searchParams.get('published');

  let query = supabase
    .from(TABLES.ARTICLES)
    .select('*')
    .order('saikiweb_created_at', { ascending: false });

  if (locale !== 'all') {
    query = query.eq('saikiweb_locale', locale);
  }
  if (published === 'true') {
    query = query.eq('saikiweb_published', true);
  } else if (published === 'false') {
    query = query.eq('saikiweb_published', false);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// POST: Create a new article
export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseOrFail();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from(TABLES.ARTICLES)
    .insert({
      saikiweb_slug: body.slug,
      saikiweb_locale: body.locale,
      saikiweb_title: body.title,
      saikiweb_excerpt: body.excerpt,
      saikiweb_body: body.body,
      saikiweb_category: body.category,
      saikiweb_category_key: body.categoryKey,
      saikiweb_date: body.date,
      saikiweb_read_time: body.readTime,
      saikiweb_layout: body.layout || 'editorial',
      saikiweb_featured: body.featured || false,
      saikiweb_published: body.published || false,
      saikiweb_meta_title: body.metaTitle || null,
      saikiweb_meta_description: body.metaDescription || null,
      saikiweb_keywords: body.keywords || null,
      saikiweb_translation_slug: body.translationSlug || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// PUT: Update an existing article
export async function PUT(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseOrFail();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  const body = await request.json();
  const id = body.id;
  if (!id) {
    return NextResponse.json({ success: false, error: 'Article ID required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(TABLES.ARTICLES)
    .update({
      saikiweb_slug: body.slug,
      saikiweb_locale: body.locale,
      saikiweb_title: body.title,
      saikiweb_excerpt: body.excerpt,
      saikiweb_body: body.body,
      saikiweb_category: body.category,
      saikiweb_category_key: body.categoryKey,
      saikiweb_date: body.date,
      saikiweb_read_time: body.readTime,
      saikiweb_layout: body.layout || 'editorial',
      saikiweb_featured: body.featured || false,
      saikiweb_published: body.published || false,
      saikiweb_meta_title: body.metaTitle || null,
      saikiweb_meta_description: body.metaDescription || null,
      saikiweb_keywords: body.keywords || null,
      saikiweb_translation_slug: body.translationSlug || null,
    })
    .eq('saikiweb_article_id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// DELETE: Delete an article
export async function DELETE(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseOrFail();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Article ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from(TABLES.ARTICLES)
    .delete()
    .eq('saikiweb_article_id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
