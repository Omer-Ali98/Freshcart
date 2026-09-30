import { NextRequest, NextResponse } from "next/server";
import { proxyApi, isId } from "@/api/server/routeProxy";
const base = "https://ecommerce.routemisr.com/api/v2/cart";
export const GET = (req: NextRequest) =>
  proxyApi(req, base, { method: "GET" }, true);
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
export async function PUT(req: NextRequest) {
  const { productId, count } = await req.json();
  if (!isId(productId) || !Number.isInteger(count) || count < 1)
    return NextResponse.json(
      { message: "Enter a valid product and quantity" },
      { status: 400 },
    );
  return proxyApi(req, `${base}/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ count }),
  });
}
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("productId");
  if (id && !isId(id))
    return NextResponse.json(
      { message: "Invalid product ID" },
      { status: 400 },
    );
  return proxyApi(req, id ? `${base}/${id}` : base, { method: "DELETE" });
}
