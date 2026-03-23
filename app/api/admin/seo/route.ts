import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';
import { invalidateSeoCache, defaultSeoConfig } from '@/lib/seo-config';

function unauthorized() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

function isAuthorized(request: NextRequest): boolean {
  const pw = request.headers.get('x-admin-password');
  return !!pw && pw === process.env.ADMIN_PASSWORD;
}

// GET - Fetch current SEO config
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: true, data: defaultSeoConfig });
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.SEO_CONFIG)
      .select('config, updated_at')
      .eq('id', 1)
      .single();

    if (error || !data) {
      // Return defaults if no row exists
      return NextResponse.json({ success: true, data: defaultSeoConfig });
    }

    // Merge with defaults – filter empty verification so env-var defaults are preserved
    const dbConfig = data.config || {};
    const dbVerification = dbConfig.verification ?? {};
    const filteredVerification = Object.fromEntries(
      Object.entries(dbVerification).filter(([, v]: [string, unknown]) => v !== '' && v != null)
    );
    const merged = {
      global: { ...defaultSeoConfig.global, ...dbConfig.global },
      verification: { ...defaultSeoConfig.verification, ...filteredVerification },
      organization: { ...defaultSeoConfig.organization, ...dbConfig.organization },
      pages: { ...defaultSeoConfig.pages, ...dbConfig.pages },
      robots: { ...defaultSeoConfig.robots, ...dbConfig.robots },
    };

    return NextResponse.json({
      success: true,
      data: merged,
      updatedAt: data.updated_at,
    });
  } catch {
    return NextResponse.json({ success: true, data: defaultSeoConfig });
  }
}

// PUT - Save SEO config
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'Database not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const config = body.config;

    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Missing config' },
        { status: 400 }
      );
    }

    // Upsert single row
    const { error } = await supabase
      .from(TABLES.SEO_CONFIG)
      .upsert(
        { id: 1, config, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Clear server-side cache
    invalidateSeoCache();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to save SEO config' },
      { status: 500 }
    );
  }
}
