import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = 
    path === "/login" || 
    path === "/signup" || 
    path === "/" ||
    path.startsWith("/api/users/login") ||
    path.startsWith("/api/users/signup");

  // Define protected paths that require authentication
  const isProtectedPath = 
    path === "/profile" || 
    path.startsWith("/profile/");

  const token = request.cookies.get("token")?.value || "";

  // Redirect to login if accessing protected path without token
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Redirect to profile if accessing public path with token
  if (isPublicPath && token && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/",
    "/profile",
    "/profile/:path*",
    "/login",
    "/signup",
  ],
};
