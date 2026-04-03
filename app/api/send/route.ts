import { NextRequest, NextResponse } from 'next/server';
import { generatePlan } from '@/lib/plan-generator';
import { formatPlan, sendWhatsApp } from '@/lib/whatsapp';
import { getSendLog, upsertSendLog } from '@/lib/db';
import { getTomorrowIST } from '@/lib/schedule';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const force = body?.force === true;
  const planDate = getTomorrowIST();

  if (!force) {
    const existing = await getSendLog(planDate);
    if (existing?.status === 'success') {
      return NextResponse.json({ success: false, message: 'Already sent' }, { status: 409 });
    }
  }

  try {
    const plan = await generatePlan(planDate);
    const message = formatPlan(plan);
    await sendWhatsApp(message);
    await upsertSendLog(planDate, 'success');
    return NextResponse.json({ success: true, message: 'Sent successfully' });
  } catch (err) {
    const errorMsg = String(err);
    await upsertSendLog(planDate, 'failed', errorMsg);
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
