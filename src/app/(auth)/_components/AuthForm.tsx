"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useEffect, useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  registerUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "@/api/actions/auth.actions";
import {
  registerSchema,
  loginSchema,
  forgotSchema,
  verifyCodeSchema,
  resetPasswordSchema,
} from "@/schema/authSchemas";
import AuthFields, { type AuthFormValues } from "./AuthFields";
import AuthShell, { AuthMode } from "./AuthShell";
const schemas = {
  login: loginSchema,
  register: registerSchema,
  forgot: forgotSchema,
  verify: verifyCodeSchema,
  reset: resetPasswordSchema,
};
function subscribeResetEmail(listener: () => void) {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}
function readResetEmail() {
  return sessionStorage.getItem("resetEmail") || "";
}
export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const search = useSearchParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const email = useSyncExternalStore(
    subscribeResetEmail,
    readResetEmail,
    () => "",
  );
  const [cooldown, setCooldown] = useState(0);
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<AuthFormValues>();
  const password = useWatch({ control, name: "password", defaultValue: "" });
  useEffect(() => {
    if (mode === "verify" || mode === "reset") {
      const saved = sessionStorage.getItem("resetEmail");
      if (!saved) {
        router.replace("/forgot-password");
        return;
      }
    }
  }, [mode, router]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  async function submit(data: AuthFormValues) {
    clearErrors();
    setMessage("");
    setError(false);
    const parsed = schemas[mode].safeParse(data);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) =>
        setFieldError(issue.path[0] as keyof AuthFormValues, {
          message: issue.message,
        }),
      );
      return;
    }
    if (mode === "register" && !data.terms) {
      setFieldError("terms", {
        message: "Please agree to the terms to continue",
      });
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          remember: data.remember ? "true" : "false",
          redirect: false,
        });
        if (!result?.ok) throw Error("Email or password is incorrect");
        const target = search.get("callbackUrl");
        router.push(
          target?.startsWith("/") && !target.startsWith("//") ? target : "/",
        );
        router.refresh();
        return;
      }
      let result;
      if (mode === "register") {
        result = await registerUser(data);
      } else if (mode === "forgot") {
        result = await forgotPassword(data.email);
      } else if (mode === "verify") {
        result = await verifyResetCode(data.resetCode);
      } else {
        result = await resetPassword(email, data.newPassword);
      }
      if (!result.ok) throw Error(result.message);
      if (mode === "register") router.push("/login?registered=1");
      if (mode === "forgot") {
        sessionStorage.setItem("resetEmail", data.email);
        router.push("/verify-code");
      }
      if (mode === "verify") {
        sessionStorage.setItem("resetVerified", "1");
        router.push("/reset-password");
      }
      if (mode === "reset") {
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetVerified");
        router.push("/login?reset=1");
      }
    } catch (e) {
      setError(true);
      setMessage(
        (e as Error).message || "Unable to connect. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function resend() {
    setBusy(true);
    setMessage("");
    try {
      const result = await forgotPassword(email);
      if (!result.ok) throw Error(result.message);
      setError(false);
      setMessage("A new reset code has been sent.");
      setCooldown(60);
    } catch (e) {
      setError(true);
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const config = {
    login: [
      "Welcome Back!",
      "Sign in to continue your fresh shopping experience",
      "Sign In",
    ],
    register: [
      "Create Your Account",
      "Start your fresh journey with us today",
      "Create My Account",
    ],
    forgot: [
      "Forgot Password?",
      "No worries, we'll send you a reset code",
      "Send Reset Code",
    ],
    verify: [
      "Check Your Email",
      `Enter the 6-digit code sent to ${email || "your email"}`,
      "Verify Code",
    ],
    reset: [
      "Create New Password",
      "Your new password must be different from previous passwords",
      "Reset Password",
    ],
  }[mode];
  return (
    <AuthShell mode={mode} title={config[0]} subtitle={config[1]}>
      {(mode === "login" || mode === "register") && (
        <>
          <div
            className={
              mode === "register" ? "grid grid-cols-2 gap-3" : "grid gap-3"
            }
          >
            {["Google", "Facebook"].map((provider, i) => (
              <button
                key={provider}
                onClick={() => {
                  setError(false);
                  setMessage(
                    `${provider} sign-in is not available yet. Please use your email and password.`,
                  );
                }}
                className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 py-3 text-sm shadow-xs"
              >
                <span
                  className={`font-bold ${i ? "text-blue-600" : "text-red-500"}`}
                >
                  {i ? "f" : "G"}
                </span>
                {mode === "login" ? "Continue with " : ""}
                {provider}
              </button>
            ))}
          </div>
          <div className="my-6 flex items-center gap-4 text-[12px] text-gray-400">
            <span className="h-px flex-1 bg-gray-100" />
            {mode === "login" ? "OR CONTINUE WITH EMAIL" : "or"}
            <span className="h-px flex-1 bg-gray-100" />
          </div>
        </>
      )}
      {mode === "login" &&
        (search.get("registered") || search.get("reset")) && (
          <p role="status" className="feedback">
            {search.get("reset")
              ? "Password reset successfully. Please sign in."
              : "Account created successfully. Please sign in."}
          </p>
        )}
      <form onSubmit={handleSubmit(submit)} noValidate>
        <AuthFields
          mode={mode}
          register={register}
          errors={errors}
          password={password}
          busy={busy}
          cooldown={cooldown}
          resend={resend}
        />
        {message && (
          <p
            role={error ? "alert" : "status"}
            className={`feedback mt-4 ${error ? "feedback-error" : ""}`}
          >
            {message}
          </p>
        )}
        <button disabled={busy} className="btn">
          {busy ? "Please wait..." : config[2]}
        </button>
      </form>
      {mode === "login" ? (
        <>
          <p className="mt-7 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
            New to FreshCart?{" "}
            <Link href="/register" className="text-green-600">
              Create an account
            </Link>
          </p>
          <div className="mt-5 flex justify-center gap-5 text-[12px] text-gray-400">
            <span>♧ SSL Secured</span>
            <span>♧ 50K+ Users</span>
            <span>☆ 4.9 Rating</span>
          </div>
        </>
      ) : mode === "register" ? (
        <p className="mt-7 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600">
            Sign In
          </Link>
        </p>
      ) : mode === "forgot" ? (
        <>
          <Link
            className="mt-4 block text-center text-xs text-green-600"
            href="/login"
          >
            ← Back to Sign In
          </Link>
          <p className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
            Remember your password?{" "}
            <Link className="text-green-600" href="/login">
              Sign In
            </Link>
          </p>
        </>
      ) : mode === "verify" ? (
        <Link
          href="/forgot-password"
          className="mt-4 block text-center text-xs text-gray-500"
        >
          ← Change email address
        </Link>
      ) : null}
    </AuthShell>
  );
}
