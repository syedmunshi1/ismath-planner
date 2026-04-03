import { NextResponse } from 'next/server';
import { resetAllOverrides } from '@/lib/db';

export async function POST() {
  await resetAllOverrides();
  return NextResponse.json({ success: true });
}
