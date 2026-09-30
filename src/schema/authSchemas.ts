import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    phone: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/\d/, "Include a number")
      .regex(/[^a-zA-Z0-9]/, "Include a symbol"),
    rePassword: z.string().min(6),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const verifyCodeSchema = z.object({
  resetCode: z
    .string()
    .regex(/^\d{6}$/, "Enter the 6-digit code sent to your email"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const checkoutSchema = z.object({
  details: z.string().min(5, "Enter your street address"),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number"),
  city: z.string().min(2, "Enter your city"),
});
