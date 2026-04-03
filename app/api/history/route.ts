import { NextRequest, NextResponse } from 'next/server';
import { getMealHistoryLast14Days } from '@/lib/db';
import { toISTDate } from '@/lib/schedule';

export async function GET(_req: NextRequest) {
  const todayIST = toISTDate();
  const history = await getMealHistoryLast14Days(todayIST);
  return NextResponse.json({ history });
}
