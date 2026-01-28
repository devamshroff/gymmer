// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getUserWithUsername, setUsername, getUsernameExists } from '@/lib/database';

// GET current user with username
export async function GET() {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const userWithUsername = await getUserWithUsername(user.id);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      username: userWithUsername?.username || null,
      hasUsername: !!userWithUsername?.username
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// POST - set username
export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (trimmedUsername.length > 20) {
      return NextResponse.json(
        { error: 'Username must be 20 characters or less' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const exists = await getUsernameExists(trimmedUsername);
    if (exists) {
      // Check if it's the user's own username
      const currentUser = await getUserWithUsername(user.id);
      if (currentUser?.username?.toLowerCase() !== trimmedUsername.toLowerCase()) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        );
      }
    }

    await setUsername(user.id, trimmedUsername);

    return NextResponse.json({
      success: true,
      username: trimmedUsername
    });
  } catch (error) {
    console.error('Error setting username:', error);
    return NextResponse.json(
      { error: 'Failed to set username' },
      { status: 500 }
    );
  }
}
