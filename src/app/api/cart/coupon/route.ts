import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export async function PUT(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session?.token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const { couponName } = await req.json();
    if (typeof couponName !== "string" || !couponName.trim())
      return NextResponse.json(
        { message: "Enter a promo code" },
        { status: 400 },
      );
    const r = await fetch(
      "https://ecommerce.routemisr.com/api/v2/cart/applyCoupon",
      {
        method: "PUT",
        headers: {
          token: String(session.token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponName: couponName.trim() }),
        cache: "no-store",
      },
    );
    return NextResponse.json(await r.json(), { status: r.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to apply promo code. Please try again." },
      { status: 502 },
    );
  }
}
