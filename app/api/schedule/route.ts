import { NextRequest, NextResponse } from 'next/server';
import { getScheduleOverridesForWeek, setScheduleOverride } from '@/lib/db';
import { getDefaultCombo, toISTDate, addDays } from '@/lib/schedule';
import { Combo } from '@/lib/types';

export async function GET(req: NextRequest) {
  const weekParam = req.nextUrl.searchParams.get('week') ?? toISTDate();
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekParam, i));
  const overrides = await getScheduleOverridesForWeek(weekParam);

  const result = days.map((date) => ({
    date,
    combo: overrides[date] ?? getDefaultCombo(date),
    isOverride: !!overrides[date],
  }));

  return NextResponse.json({ days: result });
}

export async function POST(req: NextRequest) {
  const { date, combo } = await req.json();
  if (!date || ![1,2,3,4].includes(combo)) {
    return NextResponse.json({ error: 'Invalid date or combo' }, { status: 400 });
  }
  await setScheduleOverride(date, combo as Combo);
  return NextResponse.json({ success: true });
}
