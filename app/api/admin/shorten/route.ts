import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

const DUB_API_URL = 'https://api.dub.co/links';

// GET: lookup existing short links by article_slug or long_url
export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const articleSlug = searchParams.get('article_slug');
  const longUrl = searchParams.get('long_url');

  try {
    if (longUrl) {
      // Exact lookup by long URL
      const { data, error } = await supabase
        .from(TABLES.SHORT_LINKS)
        .select('*')
        .eq('saikiweb_long_url', longUrl)
        .single();

      if (error || !data) {
        return NextResponse.json({ success: true, data: null });
      }
      return NextResponse.json({ success: true, data });
    }

    if (articleSlug) {
      // Get all short links for an article
      const { data, error } = await supabase
        .from(TABLES.SHORT_LINKS)
        .select('*')
        .eq('saikiweb_article_slug', articleSlug)
        .order('saikiweb_created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: data || [] });
    }

    return NextResponse.json({ success: false, error: 'Provide article_slug or long_url' }, { status: 400 });
  } catch (err) {
    console.error('Short link lookup error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST: shorten a URL (checks cache first, then calls Dub.co)
export async function POST(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const dubApiKey = process.env.DUB_API_KEY;
  if (!dubApiKey) {
    return NextResponse.json(
      { success: false, error: 'DUB_API_KEY not configured. Add it to your environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { url, key, domain, article_slug, platform, post_type } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 1. Check DB cache first
    if (supabase) {
      const { data: cached } = await supabase
        .from(TABLES.SHORT_LINKS)
        .select('*')
        .eq('saikiweb_long_url', url)
        .single();

      if (cached) {
        return NextResponse.json({
          success: true,
          shortLink: cached.saikiweb_short_url,
          key: cached.saikiweb_dub_key,
          domain: cached.saikiweb_dub_domain,
          url: cached.saikiweb_long_url,
          cached: true,
        });
      }
    }

    // 2. Not cached → call Dub.co API
    const dubBody: Record<string, unknown> = { url };

    const customDomain = domain || process.env.DUB_DOMAIN;
    if (customDomain) {
      dubBody.domain = customDomain;
    }

    if (key && typeof key === 'string') {
      dubBody.key = key.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    }

    const res = await fetch(DUB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dubApiKey}`,
      },
      body: JSON.stringify(dubBody),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data.error?.message || data.message || 'Failed to create short link';
      return NextResponse.json({ success: false, error: errorMsg }, { status: res.status });
    }

    // 3. Save to DB cache
    if (supabase) {
      await supabase.from(TABLES.SHORT_LINKS).upsert(
        {
          saikiweb_long_url: url,
          saikiweb_short_url: data.shortLink,
          saikiweb_dub_key: data.key,
          saikiweb_dub_domain: data.domain,
          saikiweb_article_slug: article_slug || null,
          saikiweb_platform: platform || null,
          saikiweb_post_type: post_type || null,
        },
        { onConflict: 'saikiweb_long_url' }
      );
    }

    return NextResponse.json({
      success: true,
      shortLink: data.shortLink,
      key: data.key,
      domain: data.domain,
      url: data.url,
      cached: false,
    });
  } catch (err) {
    console.error('Shorten API error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
