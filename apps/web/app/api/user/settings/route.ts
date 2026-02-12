// app/api/user/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getUserSettings, upsertUserSettings } from '@/lib/database';
import { isHeightUnit, isWeightUnit } from '@/lib/units';

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
    const weightUnitInput = body?.weightUnit;
    const heightUnitInput = body?.heightUnit;
    const timerSoundInput = body?.timerSoundEnabled;
    const timerVibrateInput = body?.timerVibrateEnabled;

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

    if (weightUnitInput !== undefined && !isWeightUnit(weightUnitInput)) {
      return NextResponse.json(
        { error: 'weightUnit must be either lbs or kg' },
        { status: 400 }
      );
    }

    if (heightUnitInput !== undefined && !isHeightUnit(heightUnitInput)) {
      return NextResponse.json(
        { error: 'heightUnit must be either in or cm' },
        { status: 400 }
      );
    }
    if (timerSoundInput !== undefined && typeof timerSoundInput !== 'boolean') {
      return NextResponse.json(
        { error: 'timerSoundEnabled must be a boolean' },
        { status: 400 }
      );
    }
    if (timerVibrateInput !== undefined && typeof timerVibrateInput !== 'boolean') {
      return NextResponse.json(
        { error: 'timerVibrateEnabled must be a boolean' },
        { status: 400 }
      );
    }

    const existingSettings = await getUserSettings(user.id);
    const weightUnit = isWeightUnit(weightUnitInput) ? weightUnitInput : existingSettings.weightUnit;
    const heightUnit = isHeightUnit(heightUnitInput) ? heightUnitInput : existingSettings.heightUnit;
    const timerSoundEnabled = typeof timerSoundInput === 'boolean'
      ? timerSoundInput
      : existingSettings.timerSoundEnabled;
    const timerVibrateEnabled = typeof timerVibrateInput === 'boolean'
      ? timerVibrateInput
      : existingSettings.timerVibrateEnabled;

    await upsertUserSettings(user.id, {
      restTimeSeconds,
      supersetRestSeconds,
      weightUnit,
      heightUnit,
      timerSoundEnabled,
      timerVibrateEnabled,
    });

    return NextResponse.json({
      success: true,
      restTimeSeconds,
      supersetRestSeconds,
      weightUnit,
      heightUnit,
      timerSoundEnabled,
      timerVibrateEnabled,
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    );
  }
}
