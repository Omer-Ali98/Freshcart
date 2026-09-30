import Image from "next/image";
import { ReactNode } from "react";
import {
  Truck,
  ShieldCheck,
  Headphones,
  Star,
  LockKeyhole,
  Mail,
  KeyRound,
  Check,
} from "lucide-react";
export type AuthMode = "login" | "register" | "forgot" | "verify" | "reset";
export default function AuthShell({
  mode,
  title,
  subtitle,
  children,
}: {
  mode: AuthMode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const recovery = ["forgot", "verify", "reset"].includes(mode);
  const step = mode === "forgot" ? 0 : mode === "verify" ? 1 : 2;
  return (
    <section
      className={`auth-wrap ${mode === "register" ? "auth-register" : ""}`}
    >
      <aside className="auth-aside">
        {mode === "register" ? (
          <>
            <h2 className="text-left text-3xl!">
              Welcome to <span className="text-green-600">FreshCart</span>
            </h2>
            <p className="text-left">
              Join thousands of happy customers who enjoy fresh groceries
              delivered right to their doorstep.
            </p>
            <div className="my-7 space-y-6 text-left">
              {[
                [
                  Star,
                  "Premium Quality",
                  "Premium quality products sourced from trusted suppliers.",
                ],
                [
                  Truck,
                  "Fast Delivery",
                  "Same-day delivery available in most areas",
                ],
                [
                  ShieldCheck,
                  "Secure Shopping",
                  "Your data and payments are completely secure",
                ],
              ].map(([I, t, d]) => {
                const Icon = I as typeof Star;
                return (
                  <div key={String(t)} className="flex items-center gap-4">
                    <span className="rounded-full bg-green-100 p-3 text-green-600">
                      <Icon size={21} />
                    </span>
                    <div>
                      <strong>{String(t)}</strong>
                      <p className="mt-1! text-sm">{String(d)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="panel bg-gray-50! p-4 text-left">
              <div className="flex items-center gap-3">
                <Image
                  src="/reference/testimonial.png"
                  alt="Sarah Johnson"
                  width={45}
                  height={45}
                  className="h-11! w-11! rounded-full! object-cover"
                />
                <div>
                  <strong className="text-sm">Sarah Johnson</strong>
                  <div className="text-yellow-400">★★★★★</div>
                </div>
              </div>
              <p className="text-sm italic">
                “FreshCart has transformed my shopping experience. The quality
                of the products is outstanding, and the delivery is always on
                time. Highly recommend!”
              </p>
            </div>
          </>
        ) : (
          <>
            <Image
              src={
                recovery
                  ? "/reference/reset-illustration.png"
                  : "/reference/login-cart.png"
              }
              alt={
                recovery
                  ? "Secure password recovery"
                  : "Fresh vegetables in a shopping cart"
              }
              width={620}
              height={384}
              priority
              className="shadow-md"
            />
            <h2>
              {recovery
                ? "Reset Your Password"
                : "FreshCart - Your One-Stop Shop for Fresh Products"}
            </h2>
            <p>
              {recovery
                ? "Don't worry, it happens to the best of us. We'll help you get back into your account in no time."
                : "Join thousands of happy customers who trust FreshCart for their daily grocery needs"}
            </p>
            <div className="mt-6 flex justify-center gap-6 text-xs text-gray-500">
              {(recovery
                ? [
                  [Mail, "Email Verification"],
                  [ShieldCheck, "Secure Reset"],
                  [LockKeyhole, "Encrypted"],
                ]
                : [
                  [Truck, "Free Delivery"],
                  [ShieldCheck, "Secure Payment"],
                  [Headphones, "24/7 Support"],
                ]
              ).map(([I, t]) => {
                const Icon = I as typeof Truck;
                return (
                  <span key={String(t)} className="flex items-center gap-1">
                    <Icon size={13} className="text-green-600" />
                    {String(t)}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </aside>
      <div className="auth-card">
        <div className="text-center">
          {mode !== "register" && (
            <div className="auth-brand">
              <span>Fresh</span>Cart
            </div>
          )}
          <h1>{title}</h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">{subtitle}</p>
        </div>
        {recovery && (
          <div
            className="steps"
            aria-label={`Password recovery step ${step + 1} of 3`}
          >
            {[Mail, KeyRound, LockKeyhole].map((Icon, i) => (
              <div key={i} className="flex items-center">
                {i > 0 && <i />}
                <span className={i <= step ? "active" : ""}>
                  {i < step ? <Check size={18} /> : <Icon size={17} />}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}
