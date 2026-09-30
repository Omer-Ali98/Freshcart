"use client";

import Link from "next/link";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import PasswordInput from "@/app/_components/PasswordInput";
import type { AuthMode } from "./AuthShell";

export type AuthFormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  rePassword: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
  remember: boolean;
  terms: boolean;
};

interface AuthFieldsProps {
  mode: AuthMode;
  register: UseFormRegister<AuthFormValues>;
  errors: FieldErrors<AuthFormValues>;
  password: string;
  busy: boolean;
  cooldown: number;
  resend: () => Promise<void>;
}

export default function AuthFields({
  mode,
  register,
  errors,
  password,
  busy,
  cooldown,
  resend,
}: AuthFieldsProps) {
  function field(
    key: keyof AuthFormValues,
    label: string,
    type = "text",
    placeholder = "",
  ) {
    return (
      <label className="block" key={key}>
        <span className="field-label">{label}</span>
        {type === "password" ? (
          <PasswordInput
            {...register(key)}
            placeholder={placeholder}
            autoComplete={
              key === "password" && mode === "login"
                ? "current-password"
                : "new-password"
            }
          />
        ) : (
          <input
            {...register(key)}
            type={type}
            className="field"
            placeholder={placeholder}
            autoComplete={
              key === "email"
                ? "email"
                : key === "phone"
                  ? "tel"
                  : key === "name"
                    ? "name"
                    : undefined
            }
          />
        )}{" "}
        {errors[key] && (
          <span className="error-text block">{errors[key]?.message}</span>
        )}
      </label>
    );
  }
  return (
    <>
        {mode === "register" && field("name", "Name*", "text", "Your name")}
        {["login", "register", "forgot"].includes(mode) &&
          field(
            "email",
            mode === "register" ? "Email*" : "Email Address",
            "email",
            mode === "forgot" ? "Enter your email address" : "Enter your email",
          )}
        {["login", "register"].includes(mode) && (
          <>
            <div className="relative">
              {mode === "login" && (
                <Link
                  href="/forgot-password"
                  className="absolute right-0 top-0 text-xs text-green-600"
                >
                  Forgot Password?
                </Link>
              )}
              {field(
                "password",
                mode === "register" ? "Password*" : "Password",
                "password",
                mode === "register"
                  ? "Create a strong password"
                  : "Enter your password",
              )}
            </div>
            {mode === "register" && (
              <>
                <div className="mt-2 flex items-center justify-between gap-2 text-[12px] text-gray-400">
                  <span>
                    Must be at least 8 characters with numbers and symbols
                  </span>
                  <span>
                    {password.length < 8
                      ? "Weak"
                      : /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)
                        ? "Strong"
                        : "Fair"}
                  </span>
                </div>
                <div className="mt-1 h-1 rounded bg-gray-100">
                  <div
                    className={`h-full rounded ${password.length < 8 ? "w-1/4 bg-red-300" : "w-full bg-green-500"}`}
                  />
                </div>
                {field(
                  "rePassword",
                  "Confirm Password*",
                  "password",
                  "Confirm your password",
                )}
                {field("phone", "Phone Number*", "tel", "01xxxxxxxxx")}
                <label className="mt-5 flex items-start gap-2 text-xs text-gray-500">
                  <input
                    className="accent-green-600"
                    type="checkbox"
                    {...register("terms")}
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/legal#terms" className="text-green-600">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/legal#privacy" className="text-green-600">
                      Privacy Policy
                    </Link>{" "}
                    *
                  </span>
                </label>
                {errors.terms && (
                  <p className="error-text">{errors.terms.message}</p>
                )}
              </>
            )}
            {mode === "login" && (
              <label className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  className="accent-green-600"
                  {...register("remember")}
                />
                Keep me signed in
              </label>
            )}
          </>
        )}
        {mode === "verify" && (
          <>
            <label className="field-label" htmlFor="code">
              Verification Code
            </label>
            <input
              id="code"
              {...register("resetCode")}
              className="field text-center text-xl tracking-[.6em]"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="••••••"
            />
            {errors.resetCode && (
              <p className="error-text">{errors.resetCode.message}</p>
            )}
            <p className="mt-4 text-center text-xs text-gray-400">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                disabled={busy || cooldown > 0}
                onClick={resend}
                className="text-green-600"
              >
                {cooldown ? `Resend in ${cooldown}s` : "Resend Code"}
              </button>
            </p>
          </>
        )}
        {mode === "reset" && (
          <>
            {field(
              "newPassword",
              "New Password",
              "password",
              "Enter new password",
            )}
            {field(
              "confirmPassword",
              "Confirm Password",
              "password",
              "Confirm new password",
            )}
          </>
        )}
    </>
  );
}
