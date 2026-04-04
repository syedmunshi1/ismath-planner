import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  const correctPin = process.env.DASHBOARD_PIN;

  if (!correctPin || pin !== correctPin) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set('dashboard_pin', pin, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
