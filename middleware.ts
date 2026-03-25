import { NextResponse, type NextRequest } from "next/server";
import { getRoleFromRequest } from "@/lib/auth-cookie";

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = getRoleFromRequest(req);

  // Require login for dashboard and forms area
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/forms")) {
    if (!role) return redirectToLogin(req);
  }

  // Admin-only routes
  const isAdminOnly =
    pathname === "/forms/new" ||
    (/^\/forms\/[^/]+$/.test(pathname) && pathname !== "/forms");

  if (isAdminOnly && role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/forms";
    return NextResponse.redirect(url);
  }

  // Keep going
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/forms/:path*"],
};

