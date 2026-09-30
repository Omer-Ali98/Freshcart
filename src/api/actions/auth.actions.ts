"use server";

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  rePassword: string;
}

async function readPayload(response: Response) {
  const payload = await response.json();
  return {
    ok: response.ok,
    message:
      payload.message || (response.ok ? "Success" : "Something went wrong"),
    data: payload,
  };
}

export async function registerUser(data: RegisterData) {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    },
  );
  return readPayload(response);
}

export async function forgotPassword(email: string) {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    },
  );
  return readPayload(response);
}

export async function verifyResetCode(resetCode: string) {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetCode }),
      cache: "no-store",
    },
  );
  return readPayload(response);
}

export async function resetPassword(email: string, newPassword: string) {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
      cache: "no-store",
    },
  );
  return readPayload(response);
}
