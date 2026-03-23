import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/id/unsubscribe?status=error', request.url)
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.redirect(
      new URL('/id/unsubscribe?status=success', request.url)
    );
  }

  // Fetch subscriber to get locale before updating
  const { data: subscriber } = await supabase
    .from(TABLES.SUBSCRIBERS)
    .select('saikiweb_locale')
    .eq('saikiweb_unsubscribe_token', token)
    .maybeSingle();

  const locale = subscriber?.saikiweb_locale || 'id';

  if (!subscriber) {
    // Token not found - invalid or already used
    return NextResponse.redirect(
      new URL(`/${locale}/unsubscribe?status=error`, request.url)
    );
  }

  const { error } = await supabase
    .from(TABLES.SUBSCRIBERS)
    .update({
      saikiweb_status: 'unsubscribed',
      saikiweb_unsubscribed_at: new Date().toISOString(),
    })
    .eq('saikiweb_unsubscribe_token', token);

  if (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.redirect(
      new URL(`/${locale}/unsubscribe?status=error`, request.url)
    );
  }

  return NextResponse.redirect(
    new URL(`/${locale}/unsubscribe?status=success`, request.url)
  );
}
