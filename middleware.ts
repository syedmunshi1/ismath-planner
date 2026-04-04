import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'dashboard_pin';

export function middleware(req: NextRequest) {
  const pin = process.env.DASHBOARD_PIN;
  if (!pin) return NextResponse.next();

  // Public routes — no auth needed
  const { pathname } = req.nextUrl;
  if (pathname === '/unauthorized' || pathname === '/api/login') {
    return NextResponse.next();
  }

  // /api/send accepts CRON_SECRET via Authorization header
  if (pathname === '/api/send') {
    const auth = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && auth === `Bearer ${cronSecret}`) return NextResponse.next();
  }

  // Check cookie
  const cookiePin = req.cookies.get(COOKIE_NAME)?.value;

  if (cookiePin !== pin) {
    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
