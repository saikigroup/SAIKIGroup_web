import { NextRequest, NextResponse } from 'next/server';

const DUB_API_URL = 'https://api.dub.co/links';

export async function POST(request: NextRequest) {
  // Auth check
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
    const { url, key, domain } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 });
    }

    // Build Dub.co API request
    const dubBody: Record<string, unknown> = {
      url, // The destination URL (with UTM params intact)
    };

    // Custom domain (e.g., s.saiki.id) — falls back to dub.sh if not set
    const customDomain = domain || process.env.DUB_DOMAIN;
    if (customDomain) {
      dubBody.domain = customDomain;
    }

    // Optional custom slug (e.g., s.saiki.id/branding-article)
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
      // Dub.co error
      const errorMsg = data.error?.message || data.message || 'Failed to create short link';
      return NextResponse.json({ success: false, error: errorMsg }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      shortLink: data.shortLink,
      key: data.key,
      domain: data.domain,
      url: data.url,
    });
  } catch (err) {
    console.error('Shorten API error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
