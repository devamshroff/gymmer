import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getWebPushPublicKey } from '@/lib/pwa/push-env';

export async function GET() {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;

  const publicKey = getWebPushPublicKey();
  return NextResponse.json({
    configured: publicKey.length > 0,
    publicKey: publicKey || null,
  });
}
