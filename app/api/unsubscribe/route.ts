import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Token is required' },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Redirect to unsubscribe confirmation page even without DB
    return NextResponse.redirect(
      new URL('/id/unsubscribe?status=success', request.url)
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
      new URL('/id/unsubscribe?status=error', request.url)
    );
  }

  return NextResponse.redirect(
    new URL('/id/unsubscribe?status=success', request.url)
  );
}
