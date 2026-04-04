import { NextRequest, NextResponse } from 'next/server';
import { generatePlan } from '@/lib/plan-generator';
import { formatPlan, sendWhatsApp } from '@/lib/whatsapp';
import { sendEmail } from '@/lib/email';
import { getSendLog, upsertSendLog } from '@/lib/db';
import { getTomorrowIST } from '@/lib/schedule';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const force = body?.force === true;
  const channel: 'whatsapp' | 'email' | 'both' = body?.channel ?? 'both';
  const planDate = getTomorrowIST();

  if (!force) {
    const existing = await getSendLog(planDate);
    if (existing?.status === 'success') {
      return NextResponse.json({ success: false, message: 'Already sent' }, { status: 409 });
    }
  }

  try {
    const plan = await generatePlan(planDate);
    const results: string[] = [];
    const errors: string[] = [];

    if ((channel === 'whatsapp' || channel === 'both') &&
        process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID &&
        process.env.WHATSAPP_RECIPIENT_NUMBER) {
      try {
        const message = formatPlan(plan);
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
        await sendEmail(plan);
        results.push('email');
      } catch (err) {
        errors.push(`Email: ${String(err)}`);
      }
    }

    if (results.length === 0 && errors.length === 0) {
      await upsertSendLog(planDate, 'failed', 'No notification channels configured');
      return NextResponse.json({ success: false, message: 'No notification channels configured' }, { status: 500 });
    }

    if (results.length > 0) {
      await upsertSendLog(planDate, 'success');
      return NextResponse.json({
        success: true,
        message: `Sent via: ${results.join(', ')}${errors.length > 0 ? ` (errors: ${errors.join('; ')})` : ''}`,
      });
    } else {
      const errorMsg = errors.join('; ');
      await upsertSendLog(planDate, 'failed', errorMsg);
      return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
    }
  } catch (err) {
    const errorMsg = String(err);
    await upsertSendLog(planDate, 'failed', errorMsg);
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
