import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const pin = process.env.DASHBOARD_PIN;
  if (!pin) return NextResponse.next(); // skip auth if PIN not set (dev mode)

  // /api/send accepts CRON_SECRET via Authorization header
  if (req.nextUrl.pathname === '/api/send') {
    const auth = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && auth === `Bearer ${cronSecret}`) return NextResponse.next();
    // Fall through to PIN check (allows manual sends from dashboard)
  }

  // Check PIN in query param or header
  const queryPin = req.nextUrl.searchParams.get('pin');
  const headerPin = req.headers.get('x-dashboard-pin');

  if (queryPin === pin || headerPin === pin) {
    return NextResponse.next();
  }

  // Return 401 for API routes, redirect to /unauthorized for pages
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = req.nextUrl.clone();
  url.pathname = '/unauthorized';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|unauthorized).*)'],
};
