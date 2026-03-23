import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

function authorize(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  return adminPassword && password === adminPassword;
}

function getSupabaseOrFail() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  return supabase;
}

// GET: List social posts with optional filters
export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseOrFail();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const status = searchParams.get('status');
  const locale = searchParams.get('locale');
  const articleSlug = searchParams.get('articleSlug');

  let query = supabase
    .from(TABLES.SOCIAL_POSTS)
    .select('*')
    .order('saikiweb_created_at', { ascending: false });

  if (platform && platform !== 'all') {
    query = query.eq('saikiweb_platform', platform);
  }
  if (status && status !== 'all') {
    query = query.eq('saikiweb_status', status);
  }
  if (locale && locale !== 'all') {
    query = query.eq('saikiweb_locale', locale);
  }
  if (articleSlug) {
    query = query.eq('saikiweb_article_slug', articleSlug);
  }

  const { data, error } = await query;

  if (error) {
    // Table may not exist yet — return empty array gracefully
    if (error.message.includes('schema cache') || error.code === '42P01') {
      return NextResponse.json({ success: true, data: [] });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// POST: Create a new social post
export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseOrFail();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  const body = await request.json();

  if (!body.platform || !body.caption) {
    return NextResponse.json({ success: false, error: 'Platform and caption are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(TABLES.SOCIAL_POSTS)
    .insert({
      saikiweb_platform: body.platform,
      saikiweb_post_type: body.postType || 'single',
      saikiweb_caption: body.caption,
      saikiweb_hashtags: body.hashtags || [],
      saikiweb_media_urls: body.mediaUrls || [],
      saikiweb_locale: body.locale || 'id',
      saikiweb_status: body.status || 'draft',
      saikiweb_scheduled_at: body.scheduledAt || null,
      saikiweb_published_at: body.publishedAt || null,
      saikiweb_post_url: body.postUrl || null,
      saikiweb_article_slug: body.articleSlug || null,
      saikiweb_category_key: body.categoryKey || 'general',
      saikiweb_notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// PUT: Update an existing social post
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
    return NextResponse.json({ success: false, error: 'Post ID required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(TABLES.SOCIAL_POSTS)
    .update({
      saikiweb_platform: body.platform,
      saikiweb_post_type: body.postType || 'single',
      saikiweb_caption: body.caption,
      saikiweb_hashtags: body.hashtags || [],
      saikiweb_media_urls: body.mediaUrls || [],
      saikiweb_locale: body.locale || 'id',
      saikiweb_status: body.status || 'draft',
      saikiweb_scheduled_at: body.scheduledAt || null,
      saikiweb_published_at: body.publishedAt || null,
      saikiweb_post_url: body.postUrl || null,
      saikiweb_article_slug: body.articleSlug || null,
      saikiweb_category_key: body.categoryKey || 'general',
      saikiweb_notes: body.notes || null,
    })
    .eq('saikiweb_post_id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// DELETE: Delete a social post
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
    return NextResponse.json({ success: false, error: 'Post ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from(TABLES.SOCIAL_POSTS)
    .delete()
    .eq('saikiweb_post_id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
