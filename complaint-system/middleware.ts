import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;

  console.log('MIDDLEWARE PATH:', pathname);
  console.log('TOKEN EXISTS:', Boolean(token));

  // Allow login page always
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Protect admin route
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      console.log('PAYLOAD:', payload);

      if (payload.accountType !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }

      return NextResponse.next();
    } catch (err) {
      console.error('JWT VERIFY FAILED', err);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
