import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, TABLES } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, name, locale } = await request.json();

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const validLocales = ['id', 'en'];
    const safeLocale = validLocales.includes(locale) ? locale : 'id';

    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured. Subscription logged.');
      console.log('Subscribe:', { email: normalizedEmail, name, locale });
      return NextResponse.json({ success: true });
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from(TABLES.SUBSCRIBERS)
      .select('saikiweb_subscriber_id, saikiweb_status')
      .eq('saikiweb_email', normalizedEmail)
      .maybeSingle();

    if (existing) {
      // Re-activate if previously unsubscribed; keep existing token
      if (existing.saikiweb_status === 'unsubscribed') {
        await supabase
          .from(TABLES.SUBSCRIBERS)
          .update({
            saikiweb_status: 'active',
            saikiweb_name: name || undefined,
            saikiweb_locale: safeLocale,
            saikiweb_subscribed_at: new Date().toISOString(),
            saikiweb_unsubscribed_at: null,
          })
          .eq('saikiweb_subscriber_id', existing.saikiweb_subscriber_id);
      }
      // If already active, do nothing (idempotent)
      return NextResponse.json({ success: true });
    }

    // New subscriber
    const token = crypto.randomBytes(32).toString('hex');

    const { error } = await supabase
      .from(TABLES.SUBSCRIBERS)
      .insert({
        saikiweb_email: normalizedEmail,
        saikiweb_name: name || null,
        saikiweb_locale: safeLocale,
        saikiweb_status: 'active',
        saikiweb_unsubscribe_token: token,
        saikiweb_source: 'contact_form',
      });

    if (error) {
      console.error('Subscribe error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscribe API error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
