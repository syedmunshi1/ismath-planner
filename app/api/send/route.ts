import { NextRequest, NextResponse } from 'next/server';
import { generatePlan } from '@/lib/plan-generator';
import { formatPlan, sendWhatsApp } from '@/lib/whatsapp';
import { sendEmail } from '@/lib/email';
import { getSendLog, upsertSendLog } from '@/lib/db';
import { getTodayIST, getTomorrowIST } from '@/lib/schedule';

export const dynamic = 'force-dynamic';

/** Shared logic for sending today + tomorrow plans */
async function doSend(channel: 'whatsapp' | 'email' | 'both', force: boolean) {
  const todayDate    = getTodayIST();
  const tomorrowDate = getTomorrowIST();

  if (!force) {
    const existing = await getSendLog(tomorrowDate);
    if (existing?.status === 'success') {
      return NextResponse.json({ success: false, message: 'Already sent' }, { status: 409 });
    }
  }

  try {
    const [todayPlan, tomorrowPlan] = await Promise.all([
      generatePlan(todayDate),
      generatePlan(tomorrowDate),
    ]);

    const results: string[] = [];
    const errors: string[] = [];

    if ((channel === 'whatsapp' || channel === 'both') &&
        process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID &&
        process.env.WHATSAPP_RECIPIENT_NUMBER) {
      try {
        // WhatsApp: send tomorrow's plan (character limit friendly)
        const message = formatPlan(tomorrowPlan);
        await sendWhatsApp(message);
        results.push('whatsapp');
      } catch (err) {
        errors.push(`WhatsApp: ${String(err)}`);
      }
    }

    if ((channel === 'email' || channel === 'both') &&
        process.env.RESEND_API_KEY &&
        process.env.NOTIFICATION_EMAIL_TO) {
      try {
        // Email: send both today + tomorrow in one message
        await sendEmail(todayPlan, tomorrowPlan);
        results.push('email');
      } catch (err) {
        errors.push(`Email: ${String(err)}`);
      }
    }

    if (results.length === 0 && errors.length === 0) {
      await upsertSendLog(tomorrowDate, 'failed', 'No notification channels configured');
      return NextResponse.json({ success: false, message: 'No notification channels configured' }, { status: 500 });
    }

    if (results.length > 0) {
      await upsertSendLog(tomorrowDate, 'success');
      return NextResponse.json({
        success: true,
        message: `Sent via: ${results.join(', ')}${errors.length > 0 ? ` (errors: ${errors.join('; ')})` : ''}`,
      });
    } else {
      const errorMsg = errors.join('; ');
      await upsertSendLog(tomorrowDate, 'failed', errorMsg);
      return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
    }
  } catch (err) {
    const errorMsg = String(err);
    await upsertSendLog(getTomorrowIST(), 'failed', errorMsg);
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}

/** GET — called by Vercel Cron (cron jobs make GET requests) */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get('authorization') ?? '';
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  // Cron always sends email; WhatsApp only if configured
  return doSend('both', true);
}

/** POST — called by dashboard buttons */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const force = body?.force === true;
  const channel: 'whatsapp' | 'email' | 'both' = body?.channel ?? 'both';
  return doSend(channel, force);
}
