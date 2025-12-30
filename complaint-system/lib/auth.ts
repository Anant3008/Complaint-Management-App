import jwt from 'jsonwebtoken';

export interface JWTPayload {
  accountType: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || '';

/**
 * Sign a JWT token with the given account type
 */
export function signToken(accountType: 'user' | 'admin'): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  const payload: JWTPayload = { accountType };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
