"use server";
import { OrderType } from "@/api/types/commonTypes";
import { getTokenData } from "@/utilities/getTokenData";
export async function getUserOrders(): Promise<OrderType[]> {
  const token = await getTokenData();
  if (!token?.token || !token.id)
    throw Error("Please sign in to view your orders");
  const r = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/user/${token.id}`,
    { headers: { token: String(token.token) }, cache: "no-store" },
  );
  if (!r.ok) throw Error("Unable to load your orders. Please try again.");
  const data = await r.json();
  return Array.isArray(data) ? data : data.data || [];
}
