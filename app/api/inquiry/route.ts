import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, TABLES, type SaikiwebInquiry } from '@/lib/supabase';
import { sendVisitorConfirmation, sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const inquiry: SaikiwebInquiry = {
      saikiweb_name: body.name,
      saikiweb_email: body.email,
      saikiweb_phone: body.phone || null,
      saikiweb_company: body.company || null,
      saikiweb_category: body.category,
      saikiweb_message: body.message,
      saikiweb_budget: body.budget || null,
      saikiweb_locale: body.locale || 'id',
      saikiweb_utm_source: body.utm_source || null,
      saikiweb_utm_medium: body.utm_medium || null,
      saikiweb_utm_campaign: body.utm_campaign || null,
      saikiweb_utm_content: body.utm_content || null,
      saikiweb_utm_term: body.utm_term || null,
      saikiweb_gclid: body.gclid || null,
      saikiweb_fbclid: body.fbclid || null,
      saikiweb_referrer: body.referrer || null,
      saikiweb_landing_page: body.landing_page || null,
      saikiweb_current_page: body.current_page || null,
    };

    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not configured. Inquiry logged but not stored.');
      console.log('Inquiry data:', JSON.stringify(inquiry));
      return NextResponse.json({ success: true, data: null });
    }

    const { error } = await supabase
      .from(TABLES.INQUIRIES)
      .insert([inquiry]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to submit inquiry', detail: error.message, code: error.code },
        { status: 500 }
      );
    }

    // Send email notifications (non-blocking - don't fail the API response)
    const emailData = {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      company: body.company || null,
      category: body.category,
      message: body.message,
      budget: body.budget || null,
      locale: body.locale || 'id',
    };

    Promise.allSettled([
      sendVisitorConfirmation(emailData),
      sendAdminNotification(emailData),
    ]).then((results) => {
      results.forEach((result, i) => {
        if (result.status === 'rejected') {
          const label = i === 0 ? 'visitor confirmation' : 'admin notification';
          console.error(`Failed to send ${label} email:`, result.reason);
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
