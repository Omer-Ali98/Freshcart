"use server";

import { checkoutSchema } from "@/schema/authSchemas";
import { getAccessToken } from "@/utilities/getTokenData";

export interface ShippingData {
  details: string;
  phone: string;
  city: string;
}

export async function payCash(cartId: string, shippingAddress: ShippingData) {
  const parsed = checkoutSchema.safeParse(shippingAddress);
  if (!/^[a-f\d]{24}$/i.test(cartId) || !parsed.success)
    return { ok: false, message: "Check your cart and shipping address" };
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Unauthorized" };

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
    {
      method: "POST",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shippingAddress }),
      cache: "no-store",
    },
  );

  const payload = await response.json();
  return { ...payload, ok: response.ok };
}

export async function payOnline(cartId: string, shippingAddress: ShippingData) {
  const parsed = checkoutSchema.safeParse(shippingAddress);
  if (!/^[a-f\d]{24}$/i.test(cartId) || !parsed.success)
    return { ok: false, message: "Check your cart and shipping address" };
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Unauthorized" };

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(baseUrl)}`,
    {
      method: "POST",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shippingAddress }),
      cache: "no-store",
    },
  );

  const payload = await response.json();
  return { ...payload, ok: response.ok };
}
