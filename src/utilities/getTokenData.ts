import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
export async function getTokenData() {
  const cookieStore = await cookies();
  const req = new NextRequest(
    process.env.NEXTAUTH_URL || "http://localhost:3000",
    { headers: { cookie: cookieStore.toString() } },
  );
  return getToken({ req, secret: process.env.NEXTAUTH_SECRET });
}
export async function getAccessToken() {
  const token = await getTokenData();
  return token?.token as string | undefined;
}
