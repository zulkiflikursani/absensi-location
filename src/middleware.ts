// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface TokenType {
  level: string;
}
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log("Middleware running", { token, path: request.nextUrl.pathname });

  if (request.nextUrl.pathname.startsWith("/home") && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (request.nextUrl.pathname === "/home/admin/adminmasuk") {
    if (!token) {
      // Not logged in, redirect to signin
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    } else if (token && "data" in token) {
      const { level } = token.data as TokenType;
      console.log("level", level);
      if (level !== "1") {
        return NextResponse.redirect(new URL("/home", request.url)); // Create a /home/forbidden page!
      }
      // Logged in, but not level 1, redirect to a forbidden/unauthorized page
    }
  }
  if (request.nextUrl.pathname === "/home/laporanadmin") {
    if (!token) {
      // Not logged in, redirect to signin
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    } else if (token && "data" in token) {
      const { level } = token.data as TokenType;
      console.log("level", level);
      if (level !== "1") {
        return NextResponse.redirect(new URL("/home", request.url)); // Create a /home/forbidden page!
      }
      // Logged in, but not level 1, redirect to a forbidden/unauthorized page
    }
  }
  return NextResponse.next();
}

export const config = {
  // matcher: ["/home/:path*", "/"],
  matcher: [
    "/home/:path*",
    "/",
    "/home/admin/adminmasuk",
    "/home/laporanadmin",
  ],
};
