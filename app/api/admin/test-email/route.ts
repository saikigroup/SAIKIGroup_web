import { NextRequest, NextResponse } from 'next/server';
import { sendVisitorConfirmation, sendAdminNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Log SMTP config (masked)
  const smtpDebug = {
    SMTP_HOST: process.env.SMTP_HOST || '(not set)',
    SMTP_PORT: process.env.SMTP_PORT || '(not set)',
    SMTP_USER: process.env.SMTP_USER ? `${process.env.SMTP_USER.slice(0, 3)}***` : '(not set)',
    SMTP_PASS: process.env.SMTP_PASS ? '***set***' : '(not set)',
    SMTP_SECURE: process.env.SMTP_SECURE || '(not set)',
    MAIL_FROM_EMAIL: process.env.MAIL_FROM_EMAIL || '(not set)',
    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME || '(not set)',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '(not set)',
  };

  const results: Record<string, unknown> = { smtpConfig: smtpDebug };

  // Test visitor confirmation
  try {
    await sendVisitorConfirmation({
      name: 'Test User',
      email: process.env.ADMIN_EMAIL || 'test@example.com',
      category: 'general',
      locale: 'id',
    });
    results.visitorEmail = 'sent successfully';
  } catch (err: unknown) {
    const error = err as Error & { code?: string; command?: string; responseCode?: number; response?: string };
    results.visitorEmail = {
      error: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
    };
  }

  // Test admin notification
  try {
    await sendAdminNotification({
      name: 'Test User',
      email: 'test@example.com',
      category: 'general',
      message: 'This is a test email from the debug endpoint.',
      locale: 'id',
    });
    results.adminEmail = 'sent successfully';
  } catch (err: unknown) {
    const error = err as Error & { code?: string; command?: string; responseCode?: number; response?: string };
    results.adminEmail = {
      error: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
    };
  }

  return NextResponse.json(results);
}
