import nodemailer from 'nodemailer';

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
            SAIKI Group &mdash; Consultancy, Imagery & Technology<br/>
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
            SAIKI Group &mdash; Consultancy, Imagery & Technology<br/>
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
            <td style="padding: 10px 0; color: #1a1a2e;">${data.phone}</td>
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
            Reply to ${data.name}
          </a>
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
