// lib/auth-utils.ts
// Helper utilities for authentication in API routes

import { auth } from "@/auth"
import { NextResponse } from "next/server"

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

/**
 * Get the current authenticated user from the session.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await auth()

  if (!session?.user?.email) {
    return null
  }

  return {
    id: session.user.email, // We use email as the user ID
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  }
}

/**
 * Require authentication for an API route.
 * Returns the user if authenticated, or a 401 response if not.
 */
export async function requireAuth(): Promise<
  { user: AuthenticatedUser } | { error: NextResponse }
> {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    }
  }

  return { user }
}
