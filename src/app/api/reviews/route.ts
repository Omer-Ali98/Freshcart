import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const base = "https://ecommerce.routemisr.com/api/v1";
async function send(req: NextRequest, method: string) {
  const productId = req.nextUrl.searchParams.get("productId");
  const reviewId = req.nextUrl.searchParams.get("reviewId");
  if (
    !/^[a-f\d]{24}$/i.test(
      (method === "GET" || method === "POST" ? productId : reviewId) || "",
    )
  )
    return NextResponse.json(
      { message: "Invalid review or product ID" },
      { status: 400 },
    );
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (method !== "GET" && !token?.token)
    return NextResponse.json(
      { message: "Please sign in first" },
      { status: 401 },
    );
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  const url =
    method === "GET" || method === "POST"
      ? `${base}/products/${productId}/reviews${method === "GET" ? `?page=${page}&limit=10` : ""}`
      : `${base}/reviews/${reviewId}`;
  try {
    let body;
    if (method === "POST" || method === "PUT") {
      const data = await req.json();
      if (
        typeof data.review !== "string" ||
        !data.review.trim() ||
        !Number.isInteger(data.rating) ||
        data.rating < 1 ||
        data.rating > 5
      )
        return NextResponse.json(
          { message: "Add your review and a rating from 1 to 5" },
          { status: 400 },
        );
      body = JSON.stringify({
        review: data.review.trim(),
        rating: data.rating,
      });
    }
    const r = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token?.token ? { token: String(token.token) } : {}),
      },
      body,
      cache: "no-store",
    });
    const data = r.status === 204 ? { status: "success" } : await r.json();
    return NextResponse.json(data, {
      status: r.status === 204 ? 200 : r.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the review service. Please try again." },
      { status: 502 },
    );
  }
}
export const GET = (req: NextRequest) => send(req, "GET");
export const POST = (req: NextRequest) => send(req, "POST");
export const PUT = (req: NextRequest) => send(req, "PUT");
export const DELETE = (req: NextRequest) => send(req, "DELETE");
