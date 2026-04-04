import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'dashboard_pin';

export function middleware(req: NextRequest) {
  const pin = process.env.DASHBOARD_PIN;
  if (!pin) return NextResponse.next(); // skip auth if PIN not set (dev mode)

  // /api/send accepts CRON_SECRET via Authorization header
  if (req.nextUrl.pathname === '/api/send') {
    const auth = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && auth === `Bearer ${cronSecret}`) return NextResponse.next();
  }

  // Check PIN sources: query param, header, or cookie
  const queryPin = req.nextUrl.searchParams.get('pin');
  const headerPin = req.headers.get('x-dashboard-pin');
  const cookiePin = req.cookies.get(COOKIE_NAME)?.value;

  const providedPin = queryPin ?? headerPin ?? cookiePin;

  if (providedPin !== pin) {
    // Invalid or missing PIN
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

  // PIN is valid — proceed and set cookie if it came from query param
  const res = NextResponse.next();
  if (queryPin === pin) {
    res.cookies.set(COOKIE_NAME, pin, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|unauthorized).*)'],
};
