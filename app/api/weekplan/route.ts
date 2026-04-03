import { NextResponse } from 'next/server';
import { generatePlan } from '@/lib/plan-generator';
import { getTomorrowIST, addDays } from '@/lib/schedule';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tomorrow = getTomorrowIST();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(tomorrow, i));

  const plans = await Promise.all(
    dates.map(async (date) => {
      try {
        return await generatePlan(date);
      } catch (err) {
        return { date, error: String(err) };
      }
    })
  );

  return NextResponse.json({ plans });
}
