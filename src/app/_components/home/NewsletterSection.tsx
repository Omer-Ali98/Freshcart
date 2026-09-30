"use client";
import { useState } from "react";
import { Mail, Check, ArrowRight, Apple, Play, Smartphone } from "lucide-react";
export default function NewsletterSection() {
  const [notice, setNotice] = useState("");
  return (
    <section className="container-main mb-16 rounded-[32px] bg-gradient-to-br from-gray-50 via-emerald-50/60 to-rose-50 p-8 shadow-sm sm:p-12">
      <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-500 p-3 text-white">
              <Mail size={20} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Newsletter
              </p>
              <span className="text-xs text-gray-400">50,000+ subscribers</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold">
            Get the Freshest Updates{" "}
            <span className="text-emerald-600">Delivered Free</span>
          </h2>
          <p className="mt-3 text-gray-500">
            Weekly recipes, seasonal offers & exclusive member perks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Fresh Picks Weekly",
              "Free Delivery Codes",
              "Members-Only Deals",
            ].map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs"
              >
                <Check
                  size={13}
                  className="rounded-full bg-emerald-100 text-emerald-600"
                />
                {t}
              </span>
            ))}
          </div>
          <form
            className="mt-7 flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setNotice(
                "Newsletter subscriptions are not available yet. Please contact support@freshcart.com for updates.",
              );
            }}
          >
            <input
              type="email"
              required
              aria-label="Newsletter email"
              placeholder="you@example.com"
              className="field flex-1"
            />
            <button className="btn bg-emerald-500">
              Subscribe
              <ArrowRight size={16} />
            </button>
          </form>
          {notice && (
            <p role="status" className="mt-3 text-sm text-gray-600">
              {notice}
            </p>
          )}
          <p className="mt-3 text-xs text-gray-400">
            ✨ Unsubscribe anytime. No spam, ever.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-7 text-white">
          <span className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-emerald-500/15 blur-xl" />
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[12px] font-bold uppercase text-emerald-400">
            <Smartphone size={11} className="mr-1 inline" />
            Mobile App
          </span>
          <h3 className="mt-5 text-xl font-bold">Shop Faster on Our App</h3>
          <p className="mt-3 text-sm text-gray-400">
            Get app-exclusive deals & 15% off your first order.
          </p>
          <div className="mt-6 grid gap-3">
            {[
              [Apple, "Download on", "App Store"],
              [Play, "Get it on", "Google Play"],
            ].map(([Icon, sub, name]) => {
              const C = Icon as typeof Apple;
              return (
                <button
                  key={String(name)}
                  onClick={() =>
                    setNotice(
                      "Mobile app download links are not available yet. You can continue shopping on this website.",
                    )
                  }
                  className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 text-left"
                >
                  <C size={22} />
                  <span>
                    <small className="block text-[12px] text-gray-400">
                      {String(sub)}
                    </small>
                    <strong className="text-sm">{String(name)}</strong>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-xs text-gray-400">
            <span className="text-yellow-400">★★★★★</span> 4.9 · 100K+ downloads
          </p>
        </div>
      </div>
    </section>
  );
}
