import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import { normalizePhoneToWA } from '@/lib/phone';

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
const fromName = process.env.MAIL_FROM_NAME || 'SAIKI Group';
const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.EMAIL_FROM || smtpUser;
const adminEmail = process.env.ADMIN_EMAIL || 'saikigroup.id@gmail.com';

function getTransporter() {
  if (!smtpUser || !smtpPass) return null;
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

const categoryLabels: Record<string, string> = {
  general: 'Pertanyaan Umum',
  consultancy: 'Consultancy',
  imagery: 'Branding & Marketing',
  technology: 'Software & Sistem',
  partnership: 'Partnership / Kolaborasi',
  career: 'Gabung Tim SAIKI',
};

export async function sendVisitorConfirmation(data: {
  name: string;
  email: string;
  category: string;
  locale: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('SMTP not configured. Skipping visitor confirmation email.');
    return;
  }

  const isEN = data.locale === 'en';

  const subject = isEN
    ? 'We received your inquiry - SAIKI Group'
    : 'Inquiry Anda sudah kami terima - SAIKI Group';

  const html = isEN
    ? `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">SAIKI Group</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1a1a2e; margin-top: 0;">Hi ${data.name},</h2>
          <p style="color: #555; line-height: 1.7;">
            Thank you for reaching out to SAIKI Group! We've received your inquiry
            under the <strong>${categoryLabels[data.category] || data.category}</strong> category.
          </p>
          <p style="color: #555; line-height: 1.7;">
            Our team will review your message and get back to you within <strong>1-2 business days</strong>.
            If your matter is urgent, feel free to reach us directly on WhatsApp.
          </p>
          <div style="margin: 24px 0; padding: 16px; background: #f0fdfa; border-left: 4px solid #0d9488; border-radius: 4px;">
            <p style="margin: 0; color: #0d9488; font-weight: 600;">What happens next?</p>
            <ol style="color: #555; margin: 8px 0 0; padding-left: 20px; line-height: 1.8;">
              <li>We read and understand your story</li>
              <li>We reach out via email or WhatsApp</li>
              <li>If it's a good fit, we set up a free consultation</li>
            </ol>
          </div>
          <p style="color: #555; line-height: 1.7;">
            Best regards,<br/>
            <strong>SAIKI Group Team</strong>
          </p>
        </div>
        <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">
            SAIKI Group | Consultancy, Imagery & Technology<br/>
            <a href="https://saiki.id" style="color: #0d9488;">saiki.id</a> &bull;
            <a href="mailto:info@saiki.id" style="color: #0d9488;">info@saiki.id</a>
          </p>
        </div>
      </div>
    `
    : `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">SAIKI Group</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1a1a2e; margin-top: 0;">Halo ${data.name},</h2>
          <p style="color: #555; line-height: 1.7;">
            Terima kasih sudah menghubungi SAIKI Group! Inquiry Anda pada kategori
            <strong>${categoryLabels[data.category] || data.category}</strong> sudah kami terima.
          </p>
          <p style="color: #555; line-height: 1.7;">
            Tim kami akan membaca pesan Anda dan merespons dalam <strong>1-2 hari kerja</strong>.
            Kalau urgent, langsung saja hubungi kami via WhatsApp.
          </p>
          <div style="margin: 24px 0; padding: 16px; background: #f0fdfa; border-left: 4px solid #0d9488; border-radius: 4px;">
            <p style="margin: 0; color: #0d9488; font-weight: 600;">Apa yang terjadi selanjutnya?</p>
            <ol style="color: #555; margin: 8px 0 0; padding-left: 20px; line-height: 1.8;">
              <li>Kami baca dan pahami cerita Anda</li>
              <li>Kami hubungi lewat email atau WhatsApp</li>
              <li>Kalau cocok, kami atur sesi diskusi gratis</li>
            </ol>
          </div>
          <p style="color: #555; line-height: 1.7;">
            Salam hangat,<br/>
            <strong>Tim SAIKI Group</strong>
          </p>
        </div>
        <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">
            SAIKI Group | Consultancy, Imagery & Technology<br/>
            <a href="https://saiki.id" style="color: #0d9488;">saiki.id</a> &bull;
            <a href="mailto:info@saiki.id" style="color: #0d9488;">info@saiki.id</a>
          </p>
        </div>
      </div>
    `;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: data.email,
    subject,
    html,
  });
}

export async function sendAdminNotification(data: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  category: string;
  message: string;
  budget?: string | null;
  locale: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('SMTP not configured. Skipping admin notification email.');
    return;
  }

  const subject = `[SAIKI Inquiry] ${categoryLabels[data.category] || data.category} - ${data.name}`;

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1a1a2e, #2d2d44); padding: 24px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">New Inquiry Received</h1>
        <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px;">via saiki.id contact form</p>
      </div>
      <div style="padding: 24px 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; width: 120px; vertical-align: top;">Name</td>
            <td style="padding: 10px 0; color: #1a1a2e; font-weight: 600;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; vertical-align: top;">Email</td>
            <td style="padding: 10px 0; color: #1a1a2e;">
              <a href="mailto:${data.email}" style="color: #0d9488;">${data.email}</a>
            </td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; vertical-align: top;">Phone</td>
            <td style="padding: 10px 0; color: #1a1a2e;">
              ${data.phone}
              ${normalizePhoneToWA(data.phone) ? ` &nbsp;<a href="https://wa.me/${normalizePhoneToWA(data.phone)}" style="color: #0d9488; font-size: 12px;">[WhatsApp]</a>` : ''}
            </td>
          </tr>
          ` : ''}
          ${data.company ? `
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; vertical-align: top;">Company</td>
            <td style="padding: 10px 0; color: #1a1a2e;">${data.company}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; vertical-align: top;">Category</td>
            <td style="padding: 10px 0; color: #1a1a2e;">
              <span style="background: #f0fdfa; color: #0d9488; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;">
                ${categoryLabels[data.category] || data.category}
              </span>
            </td>
          </tr>
          ${data.budget ? `
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; vertical-align: top;">Budget</td>
            <td style="padding: 10px 0; color: #1a1a2e;">${data.budget}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; vertical-align: top;">Locale</td>
            <td style="padding: 10px 0; color: #1a1a2e;">${data.locale.toUpperCase()}</td>
          </tr>
        </table>

        <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px; color: #94a3b8; font-size: 13px;">Message</p>
          <p style="margin: 0; color: #1a1a2e; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${data.email}" style="display: inline-block; background: #0d9488; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Reply via Email
          </a>
          ${data.phone && normalizePhoneToWA(data.phone) ? `
          &nbsp;&nbsp;
          <a href="https://wa.me/${normalizePhoneToWA(data.phone)}" style="display: inline-block; background: #25d366; color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Reply via WhatsApp
          </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: adminEmail,
    subject,
    html,
  });
}

// --- Finance email functions ---

const brandColors: Record<string, { primary: string; accent: string; label: string; sublabel: string }> = {
  consultancy: { primary: '#6B1D3A', accent: '#8B2D4A', label: 'SAIKI Consultancy', sublabel: 'Consultancy' },
  technology: { primary: '#0D4F4F', accent: '#0d9488', label: 'SAIKI Technology', sublabel: 'Technology' },
  imagery: { primary: '#1a1a2e', accent: '#2d2d44', label: 'SAIKI Imagery', sublabel: 'Imagery' },
};

export interface FinanceEmailData {
  to: string;
  subject: string;
  clientName: string;
  serviceBrand: string;
  emailBody: string;
  paymentReferences?: { label: string; badgeColor: string; value: string }[];
  amounts?: { label: string; value: string }[];
  attachedDocsList?: string;
  closingMessage?: string;
  attachments?: Mail.Attachment[];
}

export async function sendFinanceEmail(data: FinanceEmailData) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error('SMTP not configured');
  }

  const brand = brandColors[data.serviceBrand] || brandColors.consultancy;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saiki.id';
  const logoUrl = `${siteUrl}/brand/saiki-main-logo-01.svg`;
  const serviceLogo = data.serviceBrand === 'consultancy'
    ? `${siteUrl}/brand/SAIKI-CONSULTANCY.svg`
    : data.serviceBrand === 'technology'
    ? `${siteUrl}/brand/saiki-technology-white-01.svg`
    : `${siteUrl}/brand/SAIKI-IMAGERY.svg`;

  const referencesHtml = data.paymentReferences && data.paymentReferences.length > 0
    ? `
      <div style="margin: 28px 0; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
        <!-- References header -->
        <div style="background: ${brand.primary}08; padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
          <p style="margin: 0; color: ${brand.primary}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Document References</p>
        </div>
        <div style="padding: 16px 20px;">
          ${data.paymentReferences.map(ref => `
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 10px;">
              <tr>
                <td width="80" valign="top">
                  <span style="display: inline-block; background: ${ref.badgeColor}; color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">${ref.label}</span>
                </td>
                <td style="padding-left: 12px; color: #334155; font-size: 14px; line-height: 1.5;">${ref.value}</td>
              </tr>
            </table>
          `).join('')}
          ${data.amounts && data.amounts.length > 0 ? `
            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #e2e8f0;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${data.amounts.map(a => `
                  <tr>
                    <td style="color: #64748b; font-size: 14px; padding: 4px 0;">${a.label}</td>
                    <td style="color: ${brand.primary}; font-size: 14px; font-weight: 700; text-align: right; padding: 4px 0;">${a.value}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          ` : ''}
          ${data.attachedDocsList ? `
            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; font-style: italic;">${data.attachedDocsList}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f1f5f9;">
        <tr><td align="center" style="padding: 32px 16px;">
          <table cellpadding="0" cellspacing="0" border="0" width="640" style="max-width: 640px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

            <!-- Top colored header band -->
            <tr>
              <td style="background: ${brand.primary}; padding: 28px 36px;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td valign="middle">
                      <img src="${serviceLogo}" alt="${brand.label}" height="24" style="height: 24px; display: block; filter: brightness(0) invert(1);" />
                    </td>
                    <td align="right" valign="middle">
                      <span style="color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">Official Correspondence</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- SAIKI Group sub-header -->
            <tr>
              <td style="padding: 16px 36px; border-bottom: 1px solid #f0f0f0; background: #fafbfc;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td valign="middle">
                      <img src="${logoUrl}" alt="SAIKI Group" height="22" style="height: 22px; display: inline-block; vertical-align: middle;" />
                      <span style="display: inline-block; width: 1px; height: 16px; background: #e2e8f0; margin: 0 12px; vertical-align: middle;"></span>
                      <span style="color: #94a3b8; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; vertical-align: middle; font-weight: 600;">SAIKI Group</span>
                    </td>
                    <td align="right" valign="middle">
                      <span style="color: #cbd5e1; font-size: 10px; letter-spacing: 0.5px;">${brand.label}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td style="padding: 36px 36px 20px;">
                <div style="color: #1e293b; font-size: 15px; line-height: 1.75;">
                  ${data.emailBody}
                </div>

                ${referencesHtml}

                ${data.closingMessage ? `
                  <div style="color: #1e293b; font-size: 15px; line-height: 1.75; margin-top: 24px;">
                    ${data.closingMessage}
                  </div>
                ` : ''}
              </td>
            </tr>

            <!-- Signature -->
            <tr>
              <td style="padding: 0 36px 36px;">
                <div style="border-top: 1px solid #f0f0f0; padding-top: 24px;">
                  <p style="margin: 0; color: #64748b; font-size: 14px;">Sincerely,</p>
                  <p style="margin: 6px 0 0;">
                    <strong style="color: ${brand.primary}; font-size: 15px;">SAIKI</strong>
                    <strong style="color: #1e293b; font-size: 15px;"> Group</strong>
                  </p>
                  <p style="margin: 4px 0 0; color: #94a3b8; font-size: 11px; letter-spacing: 0.5px;">Beyond Your Needs</p>
                  <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px;">
                    <tr>
                      <td style="padding-right: 16px;">
                        <a href="https://saiki.id" style="color: ${brand.primary}; font-size: 12px; text-decoration: none;">saiki.id</a>
                      </td>
                      <td style="border-left: 1px solid #e2e8f0; padding-left: 16px;">
                        <a href="mailto:info@saiki.id" style="color: ${brand.primary}; font-size: 12px; text-decoration: none;">info@saiki.id</a>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #f8fafc; padding: 20px 36px; border-top: 1px solid #f0f0f0;">
                <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.6; text-align: center;">
                  This email is intended for <strong>${data.clientName}</strong>. If you received this in error, please notify the sender immediately.
                  <br/>Unauthorized use, disclosure, or distribution is prohibited.
                </p>
                <p style="color: #cbd5e1; font-size: 10px; margin: 8px 0 0; text-align: center;">
                  &copy; ${new Date().getFullYear()} SAIKI Group | Consultancy &bull; Technology &bull; Imagery
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: data.to,
    subject: data.subject,
    html,
    attachments: data.attachments,
  });
}
