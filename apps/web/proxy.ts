import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const publicPwaRoute = req.nextUrl.pathname === "/manifest.webmanifest"
    || req.nextUrl.pathname === "/sw.js"
    || req.nextUrl.pathname === "/offline";
  const publicOAuthMetadataRoute = req.nextUrl.pathname.startsWith("/.well-known/");
  if (publicPwaRoute || publicOAuthMetadataRoute) {
    return NextResponse.next()
  }

  const isE2ETest = process.env.E2E_TEST === "1" && req.headers.get("x-e2e-bypass") === "1"
  if (isE2ETest) {
    return NextResponse.next()
  }

  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname === "/login"

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
     * - api (API routes handle auth themselves)
     * - .well-known (OAuth/MCP discovery metadata)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/|\\.well-known/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
