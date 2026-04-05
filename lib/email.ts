import { Resend } from 'resend';
import { DailyPlan } from './types';
import { formatPlan } from './whatsapp';

const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  return `${DAY_NAMES[d.getUTCDay()]} ${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]}`;
}

function planBlock(plan: DailyPlan): string {
  const text = formatPlan(plan);
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<pre style="white-space:pre-wrap;margin:0;font-family:monospace;font-size:13px;line-height:1.6;">${escaped}</pre>`;
}

function buildHtmlEmail(today: DailyPlan, tomorrow: DailyPlan): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;font-size:14px;background:#f9f9f9;padding:24px;margin:0;">
<div style="max-width:640px;margin:0 auto;">

  <h2 style="color:#0d9488;margin:0 0 4px;">Today — ${dayLabel(today.date)}</h2>
  <div style="background:#fff;border-radius:8px;padding:20px;border:1px solid #e5e7eb;margin-bottom:28px;">
    ${planBlock(today)}
  </div>

  <h2 style="color:#0d9488;margin:0 0 4px;">Tomorrow — ${dayLabel(tomorrow.date)}</h2>
  <div style="background:#fff;border-radius:8px;padding:20px;border:1px solid #e5e7eb;">
    ${planBlock(tomorrow)}
  </div>

</div>
</body>
</html>`;
}

export async function sendEmail(today: DailyPlan, tomorrow: DailyPlan): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL_TO;
  // Use NOTIFICATION_EMAIL_FROM env var for a verified sender address.
  // The default onboarding@resend.dev only delivers to your Resend-registered email.
  const from = process.env.NOTIFICATION_EMAIL_FROM ?? 'Ismath Planner <onboarding@resend.dev>';

  if (!apiKey || !to) {
    throw new Error('Missing email env vars: RESEND_API_KEY, NOTIFICATION_EMAIL_TO');
  }

  const resend = new Resend(apiKey);
  const subject = `Ismath's Plan — ${dayLabel(today.date)} & ${dayLabel(tomorrow.date)}`;
  const textBody = [
    `TODAY — ${dayLabel(today.date)}`,
    '',
    formatPlan(today),
    '',
    '─'.repeat(40),
    '',
    `TOMORROW — ${dayLabel(tomorrow.date)}`,
    '',
    formatPlan(tomorrow),
  ].join('\n');

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    html: buildHtmlEmail(today, tomorrow),
    text: textBody,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
