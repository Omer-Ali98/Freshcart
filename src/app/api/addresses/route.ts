import { NextRequest, NextResponse } from "next/server";
import { proxyApi, isId } from "@/api/server/routeProxy";
import { checkoutSchema } from "@/schema/authSchemas";
const base = "https://ecommerce.routemisr.com/api/v1/addresses";
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id && !isId(id))
    return NextResponse.json(
      { message: "Invalid address ID" },
      { status: 400 },
    );
  return proxyApi(req, id ? `${base}/${id}` : base, { method: "GET" });
}
export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = checkoutSchema.safeParse(data);
  if (
    !result.success ||
    typeof data.name !== "string" ||
    data.name.trim().length < 2
  )
    return NextResponse.json(
      {
        message: result.success
          ? "Enter an address name"
          : result.error.issues[0].message,
      },
      { status: 400 },
    );
  return proxyApi(req, base, {
    method: "POST",
    body: JSON.stringify({ ...result.data, name: data.name.trim() }),
  });
}
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!isId(id))
    return NextResponse.json(
      { message: "Invalid address ID" },
      { status: 400 },
    );
  return proxyApi(req, `${base}/${id}`, { method: "DELETE" });
}
