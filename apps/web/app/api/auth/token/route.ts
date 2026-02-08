import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { upsertUser } from '@/lib/database';

export const runtime = 'nodejs';

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

type TokenInfo = {
  email?: string;
  email_verified?: string;
  name?: string;
  picture?: string;
  sub?: string;
};

type TokenResponse = {
  token: string;
  tokenType: 'app' | 'google';
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
};

function base64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signToken(payload: Record<string, unknown>, secret: string): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const signature = base64url(crypto.createHmac('sha256', secret).update(data).digest());
  return `${data}.${signature}`;
}

function isEmailAllowed(email: string): boolean {
  const allowed = process.env.ALLOWED_EMAILS?.split(',').map((e) => e.trim()).filter(Boolean) ?? [];
  if (allowed.length === 0) return true;
  return allowed.includes(email);
}

async function verifyGoogleIdToken(idToken: string): Promise<TokenInfo | null> {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );
  if (!response.ok) return null;
  const data = (await response.json()) as TokenInfo;
  if (!data?.email || data?.email_verified !== 'true') return null;
  return data;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idToken = typeof body?.idToken === 'string' ? body.idToken : null;
    if (!idToken) {
      return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
    }

    const tokenInfo = await verifyGoogleIdToken(idToken);
    if (!tokenInfo?.email) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
    }

    if (!isEmailAllowed(tokenInfo.email)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await upsertUser({
      id: tokenInfo.email,
      email: tokenInfo.email,
      name: tokenInfo.name || null,
      image: tokenInfo.picture || null,
    });

    const secret = process.env.APP_JWT_SECRET;
    const now = Math.floor(Date.now() / 1000);
    const user = {
      id: tokenInfo.email,
      email: tokenInfo.email,
      name: tokenInfo.name || null,
      image: tokenInfo.picture || null,
    };

    if (!secret) {
      const response: TokenResponse = {
        token: idToken,
        tokenType: 'google',
        expiresIn: TOKEN_TTL_SECONDS,
        user,
      };
      return NextResponse.json(response);
    }

    const token = signToken(
      {
        sub: tokenInfo.email,
        email: tokenInfo.email,
        name: tokenInfo.name || null,
        picture: tokenInfo.picture || null,
        iat: now,
        exp: now + TOKEN_TTL_SECONDS,
      },
      secret
    );

    const response: TokenResponse = {
      token,
      tokenType: 'app',
      expiresIn: TOKEN_TTL_SECONDS,
      user,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Token exchange failed:', error);
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 });
  }
}
