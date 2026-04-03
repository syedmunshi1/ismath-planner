import { Resend } from 'resend';
import { DailyPlan } from './types';
import { formatPlan } from './whatsapp';

function buildHtmlEmail(plan: DailyPlan): string {
  const text = formatPlan(plan);
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Wrap in a clean pre-formatted email
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:monospace;font-size:14px;line-height:1.6;background:#f9f9f9;padding:24px;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:24px;border:1px solid #e5e7eb;">
<pre style="white-space:pre-wrap;margin:0;">${escaped}</pre>
</div>
</body>
</html>`;
}

export async function sendEmail(plan: DailyPlan): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL_TO;
  const from = process.env.NOTIFICATION_EMAIL_FROM ?? 'Ismath Planner <onboarding@resend.dev>';

  if (!apiKey || !to) {
    throw new Error('Missing email env vars: RESEND_API_KEY, NOTIFICATION_EMAIL_TO');
  }

  const resend = new Resend(apiKey);
  const message = formatPlan(plan);

  // Format date for subject line
  const d = new Date(plan.date + 'T00:00:00Z');
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dayLabel = `${dayNames[d.getUTCDay()]} ${d.getUTCDate()} ${monthNames[d.getUTCMonth()]}`;

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Ismath's Plan — ${dayLabel}`,
    html: buildHtmlEmail(plan),
    text: message,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
