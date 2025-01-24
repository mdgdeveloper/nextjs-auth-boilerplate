import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

const { auth } = NextAuth(authConfig)

const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-request",
  "/verify-email",
  "/api/auth/callback/(.*)",
  "/api/auth/verify-email"
]

const adminRoutes = [
  "/admin"
]

const fullUrl = process.env.NEXTURL_BASE || "http://localhost:3000"

export default auth((req) => {
  const { nextUrl, auth } = req

  const isLoggedIn = !!auth?.user
  const isAdmin = auth?.user?.role === "ADMIN"

  if (!publicRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
    return NextResponse.redirect(`${fullUrl}/login`)
  }

  if (adminRoutes.includes(nextUrl.pathname) && !isAdmin) {
    return NextResponse.redirect(`${fullUrl}/dashboard`)
  }

  return NextResponse.next();
});

