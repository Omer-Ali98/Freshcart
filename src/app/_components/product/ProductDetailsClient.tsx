"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Undo2,
  Share2,
  Zap,
  Check,
} from "lucide-react";
import { ProductType } from "@/api/types/productType";
import { formatPrice } from "@/lib/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, updateCartItem } from "@/store/cartSlice";
import { useWishlist } from "@/hooks/useWishlist";
import Stars from "../catalog/Stars";
import Reviews from "./Reviews";
import { notify } from "@/lib/notify";
export default function ProductDetailsClient({
  product,
}: {
  product: ProductType;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.cart);
  const { status } = useSession();
  const wishlist = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState("details");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const gallery = product.images?.length
    ? product.images
    : [product.imageCover];
  const price = product.priceAfterDiscount ?? product.price;
  const available = product.quantity > 0;
  async function add(buy = false) {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/products/${product._id}`);
      return;
    }
    setBusy(true);
    setMessage("");
    setError(false);
    try {
      const existing =
        cart?.data.products.find((i) => i.product._id === product._id)?.count ||
        0;
      const result = await dispatch(addToCart(product._id)).unwrap();
      if (quantity > 1)
        await dispatch(
          updateCartItem({
            productId: product._id,
            count: Math.min(product.quantity, existing + quantity),
          }),
        ).unwrap();
      if (buy) router.push(`/checkout/${result.cartId || result.data._id}`);
      else { setMessage("Added to cart"); notify("Added to cart"); }
    } catch (e) {
      setError(true);
      setMessage((e as Error).message || "Unable to add product");
      notify((e as Error).message || "Unable to add product", "error");
    } finally {
      setBusy(false);
    }
  }
  async function heart() {
    try {
      await wishlist.toggle(product._id);
      setError(false);
      setMessage(
        wishlist.has(product._id)
          ? "Removed from wishlist"
          : "Added to wishlist",
      );
      notify(wishlist.has(product._id) ? "Removed from wishlist" : "Added to wishlist");
    } catch (e) {
      setError(true);
      setMessage((e as Error).message);
      notify((e as Error).message || "Unable to update wishlist", "error");
    }
  }
  async function share() {
    try {
      if (navigator.share)
        await navigator.share({
          title: product.title,
          url: window.location.href,
        });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setMessage("Product link copied");
        setError(false);
      }
    } catch {
      /* User cancelled native sharing. */
    }
  }
  return (
    <section className="container-main py-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)]">
        <div className="panel self-start p-4">
          <Image
            src={gallery[active]}
            alt={product.title}
            width={600}
            height={750}
            className="h-[430px] w-full bg-gray-50 object-contain max-md:h-[440px]"
            priority
          />
          <div className="mt-4 flex gap-2 overflow-auto">
            {gallery.map((src, i) => (
              <button
                aria-label={`View product image ${i + 1}`}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
                key={src}
                className={`shrink-0 border-2 p-1 ${active === i ? "border-gray-900" : "border-transparent"}`}
              >
                <Image
                  src={src}
                  alt=""
                  width={80}
                  height={90}
                  className="h-20 w-16 object-contain"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="panel p-6">
          <div className="flex gap-3 text-xs">
            <Link
              className="rounded bg-green-50 px-2 py-1 text-green-700"
              href={`/search?category=${product.category?._id}`}
            >
              {product.category?.name}
            </Link>
            <Link
              href={`/search?brand=${product.brand?._id}`}
              className="rounded bg-gray-50 px-2 py-1"
            >
              {product.brand?.name}
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-bold">{product.title}</h1>
          <button
            onClick={() => setTab("reviews")}
            className="mt-3 flex items-center gap-3"
          >
            <Stars rating={product.ratingsAverage} size={18} />
            <span className="text-sm text-gray-500">
              {product.ratingsAverage} ({product.ratingsQuantity} reviews)
            </span>
          </button>
          <div className="mt-5 flex gap-3">
            <strong className="text-3xl">{formatPrice(price)} EGP</strong>
            {product.priceAfterDiscount !== undefined && (
              <span className="self-end text-gray-400 line-through">
                {formatPrice(product.price)} EGP
              </span>
            )}
          </div>
          <span
            className={`mt-5 inline-block rounded px-2 py-1 text-xs ${available ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
          >
            ● {available ? "In Stock" : "Out of Stock"}
          </span>
          <p className="mt-6 border-t border-gray-100 pt-5 text-sm leading-6 text-gray-600">
            {product.description}
          </p>
          <p className="mt-5 text-sm">Quantity</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-gray-200">
              <button
                aria-label="Decrease quantity"
                disabled={quantity <= 1 || busy}
                onClick={() => setQuantity(quantity - 1)}
                className="p-3"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <button
                aria-label="Increase quantity"
                disabled={quantity >= product.quantity || busy}
                onClick={() => setQuantity(quantity + 1)}
                className="p-3"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-xs text-gray-400">
              {product.quantity} available
            </span>
          </div>
          <div className="mt-5 flex justify-between rounded-lg bg-gray-50 p-4">
            <span className="text-gray-500">Total Price:</span>
            <strong className="text-lg text-green-600">
              {formatPrice(price * quantity)} EGP
            </strong>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              disabled={busy || !available}
              onClick={() => add()}
              className="btn"
            >
              <ShoppingCart size={17} />
              {busy ? "Adding..." : "Add to Cart"}
            </button>
            <button
              disabled={busy || !available}
              onClick={() => add(true)}
              className="btn btn-dark"
            >
              <Zap size={16} />
              Buy Now
            </button>
          </div>
          <div className="mt-3 flex gap-3">
            <button
              disabled={wishlist.mutation.isPending}
              onClick={heart}
              className="btn btn-outline flex-1"
            >
              <Heart
                size={16}
                fill={wishlist.has(product._id) ? "currentColor" : "none"}
              />
              {wishlist.has(product._id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>
            <button
              aria-label="Share product"
              onClick={share}
              className="btn btn-outline px-3!"
            >
              <Share2 size={17} />
            </button>
          </div>
          {message && (
            <p
              role={error ? "alert" : "status"}
              className={`feedback mt-3 ${error ? "feedback-error" : ""}`}
            >
              {message}
            </p>
          )}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5 text-[12px] text-gray-500">
            {[
              [Truck, "Free Delivery", "Orders over $50"],
              [Undo2, "30 Days Return", "Money back"],
              [ShieldCheck, "Secure Payment", "100% Protected"],
            ].map(([I, t, d]) => {
              const Icon = I as typeof Truck;
              return (
                <div key={String(t)} className="flex items-center gap-2">
                  <Icon size={19} className="shrink-0 text-green-600" />
                  <div>
                    <strong className="block text-gray-800">{String(t)}</strong>
                    {String(d)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="panel mt-10">
        <div className="flex overflow-auto border-b border-gray-100">
          {[
            ["details", "Product Details"],
            ["reviews", `Reviews (${product.ratingsQuantity})`],
            ["shipping", "Shipping & Returns"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`whitespace-nowrap border-b-2 px-6 py-5 text-sm font-semibold ${tab === key ? "border-green-600 text-green-600" : "border-transparent text-gray-500"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === "details" ? (
            <>
              <h3 className="font-bold">About this Product</h3>
              <p className="mt-4 text-sm text-gray-500">
                {product.description}
              </p>
              <div className="mt-7 grid gap-8 bg-gray-50/70 p-5 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 font-bold">Product Information</h3>
                  {[
                    ["Category", product.category?.name],
                    [
                      "Subcategory",
                      product.subcategory?.map((s) => s.name).join(", "),
                    ],
                    ["Brand", product.brand?.name],
                    [
                      "Items Sold",
                      Number.isSafeInteger(product.sold)
                        ? `${product.sold.toLocaleString()}+ sold`
                        : "—",
                    ],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="mb-3 flex justify-between gap-4 text-xs"
                    >
                      <span className="text-gray-500">{k}</span>
                      <span>{v || "—"}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="mb-4 font-bold">Key Features</h3>
                  {[
                    "Premium Quality Product",
                    "100% Authentic Guarantee",
                    "Fast & Secure Packaging",
                    "Quality Tested",
                  ].map((t) => (
                    <p
                      className="mb-3 flex items-center gap-2 text-xs text-gray-500"
                      key={t}
                    >
                      <Check className="text-green-600" size={13} />
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            </>
          ) : tab === "reviews" ? (
            <Reviews
              productId={product._id}
              average={product.ratingsAverage || 0}
              count={product.ratingsQuantity || 0}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <h3 className="font-bold">Delivery</h3>
                <p className="mt-3 text-sm text-gray-500">
                  Review the shipping total and delivery address at checkout.
                </p>
              </div>
              <div>
                <h3 className="font-bold">Returns</h3>
                <p className="mt-3 text-sm text-gray-500">
                  Contact support to confirm eligibility and arrange a return.
                </p>
              </div>
              <div>
                <h3 className="font-bold">Secure Payment</h3>
                <p className="mt-3 text-sm text-gray-500">
                  Pay on delivery or use secure online card checkout.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
