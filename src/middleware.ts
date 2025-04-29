import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasBusinessId = request.cookies.get("business_id");

  const needsBusiness = pathname !== "/settings/general";

  if (needsBusiness && !hasBusinessId) {
    return NextResponse.redirect(new URL("/settings/general", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:path*", "/promotions/:path*", "/settings/:path*"],
};
