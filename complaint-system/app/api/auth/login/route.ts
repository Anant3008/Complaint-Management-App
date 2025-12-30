import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Check user credentials
    const userEmail = process.env.USER_EMAIL;
    const userPassword = process.env.USER_PASSWORD;
    if (email === userEmail && password === userPassword) {
      const token = signToken('user');
      const response = NextResponse.json(
        { accountType: 'user' },
        { status: 200 }
      );
      response.cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400, // 1 day
        path: '/',
      });
      return response;
    }

    // Check admin credentials
    const adminEmail = process.env.ADMIN_AUTH_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (email === adminEmail && password === adminPassword) {
      const token = signToken('admin');
      const response = NextResponse.json(
        { accountType: 'admin' },
        { status: 200 }
      );
      response.cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400, // 1 day
        path: '/',
      });
      return response;
    }

    // No match
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
