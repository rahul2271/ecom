import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { searchParams } = new URL(request.url);
  const refCode = searchParams.get('ref');

  // 1. Create the base response
  const response = NextResponse.next();

  // 2. AFFILIATE TRACKING LOGIC
  // Save referral code in a cookie for 30 days if present in URL
  if (refCode) {
    response.cookies.set('affiliate_track', refCode, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      httpOnly: false, 
      sameSite: 'lax',
    });
  }

  // 3. ADMIN PROTECTION LOGIC
  // Check if the user is trying to access the admin panel
  if (url.pathname.startsWith('/admin')) {
    // We check for a 'user-role' cookie (which your Auth system will set)
    const userRole = request.cookies.get('user-role')?.value;

    // If they aren't an ADMIN, redirect them back to the home page or login
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};