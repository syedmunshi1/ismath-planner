import { NextRequest, NextResponse } from 'next/server';
import { generatePlan } from '@/lib/plan-generator';

export async function GET(
  _req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const plan = await generatePlan(params.date);
    return NextResponse.json(plan);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
