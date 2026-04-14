import { NextRequest, NextResponse } from 'next/server';
import { generatePlan } from '@/lib/plan-generator';
import { sql } from '@vercel/postgres';

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    await sql`DELETE FROM meal_history WHERE date = ${params.date}::date`;
    const plan = await generatePlan(params.date);
    return NextResponse.json(plan);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
