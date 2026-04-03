import { NextResponse } from 'next/server';
import { getMealHistoryLast14Days } from '@/lib/db';
import { toISTDate } from '@/lib/schedule';

export const dynamic = 'force-dynamic';

export async function GET() {
  const todayIST = toISTDate();
  const history = await getMealHistoryLast14Days(todayIST);
  return NextResponse.json({ history });
}
