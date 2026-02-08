// lib/auth-utils.ts
// Helper utilities for authentication in API routes

import { auth } from "@/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

type TokenPayload = {
  sub: string
  email: string
  name?: string | null
  picture?: string | null
  iat: number
  exp: number
}

function base64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function base64urlDecode(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = normalized.length % 4
  const padded = pad ? normalized + "=".repeat(4 - pad) : normalized
  return Buffer.from(padded, "base64")
}

function verifyAppToken(token: string, secret: string): AuthenticatedUser | null {
  const parts = token.split(".")
  if (parts.length !== 3) return null
  const [headerPart, payloadPart, signaturePart] = parts
  try {
    const header = JSON.parse(base64urlDecode(headerPart).toString("utf8"))
    if (header?.alg !== "HS256" || header?.typ !== "JWT") return null
    const data = `${headerPart}.${payloadPart}`
    const expected = base64url(crypto.createHmac("sha256", secret).update(data).digest())
    if (expected !== signaturePart) return null
    const payload = JSON.parse(base64urlDecode(payloadPart).toString("utf8")) as TokenPayload
    if (!payload?.email || !payload?.sub) return null
    if (typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) return null
    return {
      id: payload.email,
      email: payload.email,
      name: payload.name ?? null,
      image: payload.picture ?? null,
    }
  } catch {
    return null
  }
}

async function verifyGoogleIdToken(idToken: string): Promise<AuthenticatedUser | null> {
  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    )
    if (!response.ok) return null
    const data = await response.json() as {
      email?: string
      email_verified?: string
      name?: string
      picture?: string
      sub?: string
    }
    if (!data?.email || data?.email_verified !== "true") return null
    const allowed = process.env.ALLOWED_EMAILS?.split(",").map((e) => e.trim()).filter(Boolean)
    if (allowed && allowed.length > 0 && !allowed.includes(data.email)) {
      return null
    }
    return {
      id: data.email,
      email: data.email,
      name: data.name ?? null,
      image: data.picture ?? null,
    }
  } catch {
    return null
  }
}

async function resolveHeaders(request?: Headers | { headers: Headers }): Promise<Headers> {
  if (!request) return await headers()
  if (request instanceof Headers) return request
  return request.headers
}

async function getUserFromAuthorization(request?: Headers | { headers: Headers }): Promise<AuthenticatedUser | null> {
  const authHeader = (await resolveHeaders(request)).get("authorization")
  if (!authHeader) return null
  const [scheme, token] = authHeader.split(" ")
  if (scheme?.toLowerCase() !== "bearer" || !token) return null

  const secret = process.env.APP_JWT_SECRET
  if (secret) {
    return verifyAppToken(token, secret)
  }

  return verifyGoogleIdToken(token)
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
export async function requireAuth(
  request?: Headers | { headers: Headers }
): Promise<{ user: AuthenticatedUser } | { error: NextResponse }> {
  if (process.env.E2E_TEST === "1") {
    return {
      user: {
        id: "e2e@test.local",
        email: "e2e@test.local",
        name: "E2E User",
      },
    }
  }

  const headerUser = await getUserFromAuthorization(request)
  if (headerUser) {
    return { user: headerUser }
  }

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
