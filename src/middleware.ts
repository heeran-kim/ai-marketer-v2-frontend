// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes pattern
const PROTECTED_ROUTES = /^\/(dashboard|settings|posts|promotions)/;

// Define authentication check routes
const AUTH_ROUTES = /^\/(login|register)/;

// Define routes that require a business to be set up
const BUSINESS_REQUIRED_ROUTES =
  /^\/(posts|promotions|settings(\/(?!general).+))/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if we're on a protected route
  const isProtectedRoute = PROTECTED_ROUTES.test(pathname);

  // Check if we're on an auth route (login/register)
  const isAuthRoute = AUTH_ROUTES.test(pathname);

  // Check if the route requires business setup to be completed
  const isBusinessRequiredRoute = BUSINESS_REQUIRED_ROUTES.test(pathname);

  // Get authentication token from cookies
  const token = request.cookies.get("access_token")?.value;

  // Get business ID from cookies
  const businessId = request.cookies.get("business_id")?.value;

  // If trying to access protected route without auth token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authenticated user tries to access auth routes, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If trying to access business required route without business id, redirect to settings
  if (isBusinessRequiredRoute && token && !businessId) {
    return NextResponse.redirect(new URL("/settings/general", request.url));
  }

  // Continue with the request for all other cases
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Match all routes except static files, api routes, etc.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
