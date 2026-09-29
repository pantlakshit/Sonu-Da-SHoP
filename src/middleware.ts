import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login without session check
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    const hasAdminSession =
      request.cookies.has('berinag_admin_session') ||
      Array.from(request.cookies.getAll()).some(
        (c) => c.name.includes('auth-token') || c.name.startsWith('sb-')
      );

    if (!hasAdminSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
