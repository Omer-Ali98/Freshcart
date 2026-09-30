"use server";

import { getAccessToken } from "@/utilities/getTokenData";

export async function updateProfile(data: {
  name: string;
  email: string;
  phone: string;
}) {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Please sign in first" };

  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/users/updateMe/",
    {
      method: "PUT",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    },
  );

  const payload = await response.json();
  return {
    ok: response.ok,
    message: payload.message || "Profile updated",
    data: payload,
  };
}

export async function changePassword(data: {
  currentPassword: string;
  password: string;
  rePassword: string;
}) {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Please sign in first" };

  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
    {
      method: "PUT",
      headers: {
        token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    },
  );

  const payload = await response.json();
  return {
    ok: response.ok,
    message: payload.message || "Password updated",
    data: payload,
  };
}
