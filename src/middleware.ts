// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log("Middleware running", { token, path: request.nextUrl.pathname });

  if (request.nextUrl.pathname.startsWith("/home") && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/"],
};
