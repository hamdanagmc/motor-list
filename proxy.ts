import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

// Next 16 renamed middleware to proxy. Every route except /login (and auth/webhook APIs) needs a session.
export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, search } = req.nextUrl;

  if (pathname === "/login") {
    return token ? NextResponse.redirect(new URL("/vehicle-stock", req.url)) : NextResponse.next();
  }
  if (!token) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|api/revalidate|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)",
  ],
};
