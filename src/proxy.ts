import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const protectedPages = [
    "/cart",
    "/wishlist",
    "/checkout",
    "/orders",
    "/profile",
  ];
  const authPages = ["/login", "/register"];
  const pathname = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (
    !token?.token &&
    protectedPages.some((path) => pathname.startsWith(path))
  ) {
    const login = new URL("/login", req.nextUrl);
    login.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(login);
  }

  if (token?.token && authPages.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/login/:path*",
    "/register/:path*",
  ],
};
