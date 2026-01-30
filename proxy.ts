import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isE2ETest = process.env.E2E_TEST === "1" && req.headers.get("x-e2e-bypass") === "1"
  if (isE2ETest) {
    return NextResponse.next()
  }

  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname === "/login"
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")

  // Allow auth routes to pass through
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // Redirect logged-in users away from login page
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Redirect unauthenticated users to login
  if (!isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
