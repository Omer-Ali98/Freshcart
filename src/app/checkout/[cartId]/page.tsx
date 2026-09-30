"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
  Plus,
  Info,
  ShoppingBag,
  Lock,
  Check,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/app/_components/PageHeader";
import { checkoutSchema } from "@/schema/authSchemas";
import { payCash, payOnline } from "@/api/actions/payment.actions";
import { AddressesResponse, AddressType } from "@/api/types/commonTypes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCart, resetCart } from "@/store/cartSlice";
import { formatPrice } from "@/lib/format";
type Data = z.infer<typeof checkoutSchema>;
export default function Checkout() {
  const { cartId } = useParams<{ cartId: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { cart, isLoading, error } = useAppSelector((s) => s.cart);
  const [payment, setPayment] = useState<"cash" | "online">("cash");
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Data>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { details: "", phone: "", city: "" },
  });
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);
  const addresses = useQuery<AddressesResponse>({
    queryKey: ["addresses", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const r = await fetch("/api/addresses");
      const j = await r.json();
      if (!r.ok) throw Error(j.message || "Unable to load saved addresses");
      return j;
    },
  });
  const products = cart?.data.products || [];
  const valid =
    !!products.length && (cart?.cartId === cartId || cart?.data._id === cartId);
  function address(a?: AddressType) {
    setSelected(a?._id || "");
    reset(
      a
        ? { details: a.details, phone: a.phone, city: a.city }
        : { details: "", phone: "", city: "" },
    );
  }
  async function submit(data: Data) {
    if (!valid || busy || submitted) return;
    setBusy(true);
    setMessage("");
    try {
      if (payment === "cash") {
        const result = await payCash(cartId, data);
        if (!result.ok)
          throw Error(result.message || "Order could not be placed");
        setSubmitted(true);
        dispatch(resetCart());
        router.replace("/orders?placed=1");
        router.refresh();
      } else {
        const result = await payOnline(cartId, data);
        if (!result.ok || !result.session?.url)
          throw Error(result.message || "Unable to start online checkout");
        const url = new URL(result.session.url);
        if (url.protocol !== "https:") throw Error("Invalid checkout URL");
        setSubmitted(true);
        window.location.assign(url.toString());
      }
    } catch (e) {
      setMessage(
        (e as Error).message || "Unable to connect. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const subtotal = cart?.data.totalCartPrice ?? 0;
  const total = cart?.data.totalPriceAfterDiscount ?? subtotal;
  return (
    <section className="bg-gray-50/70">
      <PageHeader
        title="Complete Your Order"
        breadcrumb="Cart / Checkout"
        subtitle="Review your items and complete your purchase"
        back={{ label: "Back to Cart", href: "/cart" }}
      />
      <div className="container-main pb-16">
        {isLoading && !cart ? (
          <p className="py-20 text-center">Loading your cart...</p>
        ) : submitted ? (
          <p role="status" className="py-20 text-center">
            {payment === "cash"
              ? "Order placed. Opening your orders..."
              : "Opening secure payment..."}
          </p>
        ) : error || !valid ? (
          <div role="alert" className="panel p-8 text-center">
            <p>
              {error ||
                "This checkout is no longer available. Please review your current cart."}
            </p>
            <Link href="/cart" className="btn mt-5">
              Back to Cart
            </Link>
          </div>
        ) : (
          <div className="checkout-grid">
            <form
              id="checkout-form"
              onSubmit={handleSubmit(submit)}
              className="space-y-6"
            >
              <section className="panel">
                <div className="panel-title">
                  <h2 className="flex items-center gap-2">
                    <MapPin size={20} />
                    Shipping Address
                  </h2>
                  <p>Where should we deliver your order?</p>
                </div>
                <div className="p-6">
                  {addresses.isPending ? (
                    <p className="mb-5 text-xs text-gray-400">
                      Loading saved addresses...
                    </p>
                  ) : addresses.isError ? (
                    <p className="mb-5 text-xs text-amber-600">
                      Saved addresses could not be loaded. Enter your address
                      below or{" "}
                      <button
                        type="button"
                        className="underline"
                        onClick={() => addresses.refetch()}
                      >
                        retry
                      </button>
                      .
                    </p>
                  ) : (
                    !!addresses.data?.data.length && (
                      <>
                        <h3 className="font-semibold">Saved Addresses</h3>
                        <p className="mt-2 text-xs text-gray-500">
                          Select a saved address or enter a new one below
                        </p>
                        <div className="mt-4 space-y-3">
                          {addresses.data.data.map((a) => (
                            <button
                              type="button"
                              aria-pressed={selected === a._id}
                              key={a._id}
                              onClick={() => address(a)}
                              className={`flex w-full gap-3 rounded-lg border p-4 text-left ${selected === a._id ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                            >
                              <MapPin size={18} className="text-gray-400" />
                              <div>
                                <strong className="text-sm">{a.name}</strong>
                                <p className="mt-1 text-xs text-gray-500">
                                  {a.details}
                                </p>
                                <p className="mt-2 text-xs text-gray-400">
                                  {a.phone} · {a.city}
                                </p>
                              </div>
                              {selected === a._id && (
                                <Check
                                  className="ml-auto text-green-600"
                                  size={18}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => address()}
                    className={`mt-4 flex w-full items-center gap-3 rounded-lg border border-dashed p-4 text-left ${!selected ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                  >
                    <span className="rounded-lg bg-green-500 p-2 text-white">
                      <Plus size={18} />
                    </span>
                    <span>
                      <strong className="text-sm text-green-700">
                        Use a different address
                      </strong>
                      <span className="mt-1 block text-xs text-gray-400">
                        Enter a new shipping address manually
                      </span>
                    </span>
                  </button>
                  <div className="my-6 flex gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-blue-500">
                    <Info size={15} />
                    <div>
                      <strong>Delivery Information</strong>
                      <p className="mt-1">
                        Please ensure your address is accurate for smooth
                        delivery
                      </p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {[
                      ["city", "City", "e.g. Cairo, Alexandria, Giza"],
                      [
                        "details",
                        "Street Address",
                        "Street name, building number, floor, apartment...",
                      ],
                      ["phone", "Phone Number", "01xxxxxxxxx"],
                    ].map(([name, label, placeholder]) => (
                      <label className="block" key={name}>
                        <span className="field-label">{label} *</span>
                        {name === "details" ? (
                          <textarea
                            {...register("details")}
                            rows={3}
                            className="field"
                            placeholder={placeholder}
                          />
                        ) : (
                          <input
                            {...register(name as keyof Data)}
                            type={name === "phone" ? "tel" : "text"}
                            className="field"
                            placeholder={placeholder}
                          />
                        )}{" "}
                        {errors[name as keyof Data] && (
                          <span className="error-text">
                            {errors[name as keyof Data]?.message}
                          </span>
                        )}
                        {name === "phone" && (
                          <p className="mt-1 text-right text-[12px] text-gray-400">
                            Egyptian numbers only
                          </p>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </section>
              <section className="panel">
                <div className="panel-title">
                  <h2 className="flex items-center gap-2">
                    <CreditCard size={20} />
                    Payment Method
                  </h2>
                  <p>Choose how you&apos;d like to pay</p>
                </div>
                <div className="space-y-3 p-6">
                  {[
                    [
                      "cash",
                      Truck,
                      "Cash on Delivery",
                      "Pay when your order arrives at your doorstep",
                    ],
                    [
                      "online",
                      CreditCard,
                      "Pay Online",
                      "Secure payment with Credit/Debit Card via Stripe",
                    ],
                  ].map(([key, I, title, desc]) => {
                    const Icon = I as typeof Truck;
                    return (
                      <label
                        key={String(key)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${payment === key ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                      >
                        <span
                          className={`rounded-lg p-3 ${payment === key ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}
                        >
                          <Icon size={20} />
                        </span>
                        <span className="flex-1">
                          <strong className="text-sm">{String(title)}</strong>
                          <span className="mt-1 block text-xs text-gray-400">
                            {String(desc)}
                          </span>
                          {key === "online" && (
                            <span className="mt-2 block text-xs">
                              ▰ VISA　● Mastercard
                            </span>
                          )}
                        </span>
                        <input
                          className="accent-green-600"
                          type="radio"
                          name="payment"
                          value={String(key)}
                          checked={payment === key}
                          onChange={() => setPayment(key as "cash" | "online")}
                        />
                      </label>
                    );
                  })}
                  <div className="flex gap-2 rounded-lg bg-gray-50 p-3 text-xs text-green-600">
                    <ShieldCheck size={16} />
                    <span>
                      <strong>Secure & Encrypted</strong>
                      <br />
                      Your payment info is protected.
                    </span>
                  </div>
                </div>
              </section>
              {message && (
                <p role="alert" className="feedback feedback-error">
                  {message}
                </p>
              )}
            </form>
            <aside className="panel h-fit md:sticky md:top-5">
              <div className="panel-title">
                <h2 className="flex items-center gap-2">
                  <ShoppingBag size={20} />
                  Order Summary
                </h2>
                <p>{products.length} items</p>
              </div>
              <div className="p-5">
                <div className="max-h-96 space-y-5 overflow-y-auto">
                  {products.map((i) => (
                    <div key={i._id} className="flex items-center gap-3">
                      <Image
                        src={i.product.imageCover}
                        alt={i.product.title}
                        width={45}
                        height={50}
                        className="h-12 w-10 rounded bg-gray-50 object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">
                          {i.product.title}
                        </p>
                        <p className="mt-1 text-[13px] text-gray-400">
                          {i.count} × {formatPrice(i.price)} EGP
                        </p>
                      </div>
                      <strong className="text-xs">
                        {formatPrice(i.count * i.price)}
                      </strong>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3 border-b border-gray-100 pb-5 text-xs">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)} EGP</span>
                  </div>
                  {total < subtotal && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>−{formatPrice(subtotal - total)} EGP</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">
                      {total >= 500 ? "FREE" : "Confirmed with order"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between py-5">
                  <strong>Total</strong>
                  <strong className="text-xl text-green-600">
                    {formatPrice(total)} <small className="text-xs">EGP</small>
                  </strong>
                </div>
                <button
                  disabled={busy || isLoading || submitted}
                  form="checkout-form"
                  className="btn w-full"
                >
                  <Lock size={16} />
                  {busy
                    ? "Processing..."
                    : payment === "online"
                      ? "Proceed to Payment"
                      : "Place Order"}
                </button>
                <div className="mt-5 flex justify-between text-[12px] text-gray-400">
                  <span>🛡 Secure</span>
                  <span>🚚 Fast Delivery</span>
                  <span>↩ Easy Returns</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
