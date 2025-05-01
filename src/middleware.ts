// src/middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("access_token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const hasBusinessId = request.cookies.get("business_id");

  const needsBusiness = !["/settings/general", "/dashboard"].includes(pathname);

  if (needsBusiness && !hasBusinessId) {
    return NextResponse.redirect(new URL("/settings/general", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/posts/:path*",
    "/promotions/:path*",
    "/settings/:path*",
  ],
};
