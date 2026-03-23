import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, TABLES } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, name, locale } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured. Subscription logged.');
      console.log('Subscribe:', { email, name, locale });
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString('hex');

    const { error } = await supabase
      .from(TABLES.SUBSCRIBERS)
      .upsert(
        {
          saikiweb_email: email.toLowerCase().trim(),
          saikiweb_name: name || null,
          saikiweb_locale: locale || 'id',
          saikiweb_status: 'active',
          saikiweb_unsubscribe_token: token,
          saikiweb_source: 'contact_form',
          saikiweb_subscribed_at: new Date().toISOString(),
          saikiweb_unsubscribed_at: null,
        },
        { onConflict: 'saikiweb_email' }
      );

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
