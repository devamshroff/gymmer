import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getCurrentUser } from '@/lib/auth-utils';

export const runtime = 'nodejs';

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const ALLOWED_SCREENSHOT_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp'
]);

function normalizeText(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getFilename(file: File): string {
  if (file.name) return file.name;
  const extension = file.type.split('/')[1] || 'png';
  return `screenshot.${extension}`;
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BUG_REPORT_FROM_EMAIL;
  const toEmail = process.env.BUG_REPORT_TO_EMAIL;

  if (!resendApiKey || !fromEmail || !toEmail) {
    console.error('Missing Resend configuration for bug reports.');
    return NextResponse.redirect(
      new URL('/report-bug?status=error', request.url),
      303
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('Failed to read bug report form data.', error);
    return NextResponse.redirect(
      new URL('/report-bug?status=error', request.url),
      303
    );
  }

  const description = normalizeText(formData.get('description'));
  const steps = normalizeText(formData.get('steps'));
  const screenshot = formData.get('screenshot');

  if (!description) {
    return NextResponse.redirect(
      new URL('/report-bug?status=error', request.url),
      303
    );
  }

  let attachment:
    | {
        filename: string;
        content: string;
      }
    | undefined;

  if (screenshot instanceof File && screenshot.size > 0) {
    if (!ALLOWED_SCREENSHOT_TYPES.has(screenshot.type) || screenshot.size > MAX_SCREENSHOT_BYTES) {
      return NextResponse.redirect(
        new URL('/report-bug?status=invalid-file', request.url),
        303
      );
    }

    const buffer = Buffer.from(await screenshot.arrayBuffer());
    attachment = {
      filename: getFilename(screenshot),
      content: buffer.toString('base64')
    };
  }

  const user = await getCurrentUser();
  const referer = request.headers.get('referer') || 'Unknown';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  const reporterLine = user
    ? `${user.name ? `${user.name} ` : ''}<${user.email}>`
    : 'Anonymous user';
  const replyTo = user?.email;
  const fromAddress = replyTo ? `${replyTo} <${fromEmail}>` : fromEmail;

  const textBody = [
    'New bug report',
    '',
    `Reporter: ${reporterLine}`,
    `Page: ${referer}`,
    `User-Agent: ${userAgent}`,
    '',
    'Description:',
    description,
    '',
    'Steps to reproduce:',
    steps || 'Not provided.'
  ].join('\n');

  const htmlBody = `
    <h2>New bug report</h2>
    <p><strong>Reporter:</strong> ${escapeHtml(reporterLine)}</p>
    <p><strong>Page:</strong> ${escapeHtml(referer)}</p>
    <p><strong>User-Agent:</strong> ${escapeHtml(userAgent)}</p>
    <h3>Description</h3>
    <p>${escapeHtml(description).replace(/\n/g, '<br />')}</p>
    <h3>Steps to reproduce</h3>
    <p>${escapeHtml(steps || 'Not provided.').replace(/\n/g, '<br />')}</p>
  `;

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: fromAddress,
      to: toEmail,
      subject: `Bug report from ${reporterLine}`,
      text: textBody,
      html: htmlBody,
      attachments: attachment ? [attachment] : undefined,
      reply_to: replyTo
    });
  } catch (error) {
    console.error('Failed to send bug report email.', error);
    return NextResponse.redirect(
      new URL('/report-bug?status=error', request.url),
      303
    );
  }

  return NextResponse.redirect(
    new URL('/report-bug?status=sent', request.url),
    303
  );
}
