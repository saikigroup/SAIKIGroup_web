import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token || token.length < 20) {
    return NextResponse.json({ success: false, error: 'Invalid verification token' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Service unavailable' }, { status: 500 });
  }

  const { data: doc, error } = await supabase
    .from(TABLES.DOCUMENTS)
    .select('*')
    .eq('saikiweb_verification_token', token)
    .single();

  if (error || !doc) {
    console.error('Document verification error:', error?.message);
    return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
  }

  // Only return limited data for public verification
  return NextResponse.json({
    success: true,
    data: {
      document_number: doc.saikiweb_document_number,
      document_name: doc.saikiweb_document_name,
      document_type: doc.saikiweb_document_type,
      document_date: doc.saikiweb_document_date,
      service_brand: doc.saikiweb_service_brand,
      status: doc.saikiweb_status,
      issued_to: doc.saikiweb_issued_to,
      issued_by: doc.saikiweb_issued_by,
      description: doc.saikiweb_description,
      signer_name: doc.saikiweb_signer_name,
      signer_title: doc.saikiweb_signer_title,
      valid_until: doc.saikiweb_valid_until,
    },
  });
}
