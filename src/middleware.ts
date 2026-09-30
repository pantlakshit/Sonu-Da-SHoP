import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.SESSION_SECRET;

export async function middleware(request: NextRequest) {
  if (!SECRET_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET environment variable is required in production.');
    }
  }
  const key = new TextEncoder().encode(SECRET_KEY || 'development-fallback-key');
  const { pathname } = request.nextUrl;

  // Allow /admin/login without session check
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('karki_admin_session')?.value;

    let hasValidSession = false;
    if (sessionCookie) {
      try {
        const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
        if (payload && payload.role === 'admin') {
          hasValidSession = true;
        }
      } catch (error) {
        // Invalid session
      }
    }

    if (!hasValidSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
