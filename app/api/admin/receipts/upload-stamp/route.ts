import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, TABLES } from '@/lib/supabase';

const BUCKET = 'finance-documents';
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const receiptId = formData.get('receipt_id') as string | null;
    const documentType = formData.get('document_type') as string | null; // 'receipt' or 'invoice'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!receiptId) {
      return NextResponse.json({ success: false, error: 'Receipt ID required' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File too large (max 20MB)' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find((b) => b.name === BUCKET)) {
      await supabase.storage.createBucket(BUCKET, { public: true });
    }

    // Generate filename
    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_');
    const timestamp = Date.now();
    const prefix = documentType === 'invoice' ? 'invoice' : 'receipt';
    const filename = `stamped/${prefix}_${receiptId}_${timestamp}_${sanitized}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    const fileUrl = urlData.publicUrl;

    // Update receipt stamp status
    const { error: updateErr } = await supabase
      .from(TABLES.RECEIPTS)
      .update({
        saikiweb_stamp_status: 'stamped',
        saikiweb_stamped_file_url: fileUrl,
      })
      .eq('saikiweb_receipt_id', receiptId);

    if (updateErr) {
      console.error('Failed to update receipt stamp status:', updateErr);
      return NextResponse.json({ success: false, error: 'File uploaded but failed to update receipt' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: file.name,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
