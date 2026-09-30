import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export const isId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
export async function proxyApi(
  req: NextRequest,
  url: string,
  init: RequestInit,
  emptyCart = false,
) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session?.token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const r = await fetch(url, {
      ...init,
      headers: {
        token: String(session.token),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (emptyCart && r.status === 404)
      return NextResponse.json({
        status: "success",
        numOfCartItems: 0,
        cartId: "",
        data: {
          _id: "",
          cartOwner: session.id,
          products: [],
          totalCartPrice: 0,
        },
      });
    const payload = r.status === 204 ? { status: "success" } : await r.json();
    return NextResponse.json(payload, {
      status: r.status === 204 ? 200 : r.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect. Please try again." },
      { status: 502 },
    );
  }
}
