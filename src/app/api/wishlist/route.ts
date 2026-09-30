import { NextRequest, NextResponse } from "next/server";
import { proxyApi, isId } from "@/api/server/routeProxy";
const base = "https://ecommerce.routemisr.com/api/v1/wishlist";
export const GET = (req: NextRequest) => proxyApi(req, base, { method: "GET" });
export async function POST(req: NextRequest) {
  const { productId } = await req.json();
  if (!isId(productId))
    return NextResponse.json(
      { message: "Invalid product ID" },
      { status: 400 },
    );
  return proxyApi(req, base, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("productId");
  if (!isId(id))
    return NextResponse.json(
      { message: "Invalid product ID" },
      { status: 400 },
    );
  return proxyApi(req, `${base}/${id}`, { method: "DELETE" });
}
