import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/admin');
    const isUsersPage = req.nextUrl.pathname.startsWith('/admin/settings/users');

    if (isAuthPage) {
      if (isAuth && req.nextUrl.pathname === '/admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }

      if (isUsersPage && token?.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }

      return null;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};