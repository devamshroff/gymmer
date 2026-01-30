// app/api/user/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getUserSettings, upsertUserSettings } from '@/lib/database';

export async function GET() {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const settings = await getUserSettings(user.id);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const restTimeSeconds = Number(body?.restTimeSeconds);
    const supersetRestSeconds = Number(body?.supersetRestSeconds);

    if (!Number.isFinite(restTimeSeconds) || restTimeSeconds < 0) {
      return NextResponse.json(
        { error: 'restTimeSeconds must be a non-negative number' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(supersetRestSeconds) || supersetRestSeconds < 0) {
      return NextResponse.json(
        { error: 'supersetRestSeconds must be a non-negative number' },
        { status: 400 }
      );
    }

    await upsertUserSettings(user.id, {
      restTimeSeconds,
      supersetRestSeconds
    });

    return NextResponse.json({
      success: true,
      restTimeSeconds,
      supersetRestSeconds
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    );
  }
}
