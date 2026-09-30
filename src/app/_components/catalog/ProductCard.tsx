"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Eye, RefreshCw, LoaderCircle, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ProductType } from "@/api/types/productType";
import { formatPrice, getDiscount } from "@/lib/format";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/providers/CompareProvider";
import Modal from "../Modal";
import Stars from "./Stars";
import { notify } from "@/lib/notify";
export default function ProductCard({ product }: { product: ProductType }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { status } = useSession();
  const wishlist = useWishlist();
  const compare = useCompare();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const discount = getDiscount(product.price, product.priceAfterDiscount);
  async function cart() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await dispatch(addToCart(product._id)).unwrap();
      setAdded(true);
      notify("Added to cart");
      setTimeout(() => setAdded(false), 1800);
    } catch (e) {
      setError((e as Error).message || "Unable to add product");
      notify((e as Error).message || "Unable to add product", "error");
    } finally {
      setBusy(false);
    }
  }
  async function heart() {
    setError("");
    try {
      await wishlist.toggle(product._id);
      notify(saved ? "Removed from wishlist" : "Added to wishlist");
    } catch (e) {
      setError((e as Error).message);
      notify((e as Error).message || "Unable to update wishlist", "error");
    }
  }
  const saved = wishlist.has(product._id);
  return (
    <>
      <article className="product-card">
        {discount > 0 && <span className="discount">-{discount}%</span>}
        <div className="product-actions">
          <button
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={saved}
            className={saved ? "active" : ""}
            disabled={wishlist.mutation.isPending}
            onClick={heart}
          >
            <Heart size={15} fill={saved ? "currentColor" : "none"} />
          </button>
          <button
            aria-label="Compare product"
            aria-pressed={compare.items.some((i) => i._id === product._id)}
            onClick={() => compare.toggle(product)}
          >
            <RefreshCw size={14} />
          </button>
          <button aria-label="Quick view" onClick={() => setPreview(true)}>
            <Eye size={15} />
          </button>
        </div>
        <Link href={`/products/${product._id}`}>
          <Image
            src={product.imageCover}
            alt={product.title}
            width={350}
            height={350}
            sizes="(max-width:767px) 90vw,20vw"
            className="product-image"
          />
        </Link>
        <div className="product-info mt-5 flex flex-1 flex-col">
          <p className="text-[13px] text-gray-400">{product.category?.name}</p>
          <Link
            href={`/products/${product._id}`}
            className="mt-1 line-clamp-2-custom min-h-10 text-sm leading-5"
          >
            {product.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Stars rating={product.ratingsAverage || 0} />
            <span className="text-[13px] text-gray-400">
              {product.ratingsAverage || 0} ({product.ratingsQuantity || 0})
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <div className="text-sm font-semibold">
              <span className={discount > 0 ? "text-green-600" : ""}>
                {formatPrice(product.priceAfterDiscount ?? product.price)} EGP
              </span>
              {discount > 0 && (
                <span className="ml-2 text-[12px] font-normal text-gray-400 line-through">
                  {formatPrice(product.price)} EGP
                </span>
              )}
            </div>
            <button
              disabled={busy || product.quantity === 0}
              onClick={cart}
              className="round-add"
              aria-label={
                product.quantity === 0 ? "Out of stock" : "Add to cart"
              }
            >
              {busy ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : added ? (
                <Check size={17} />
              ) : (
                <Plus size={20} />
              )}
            </button>
          </div>
          {error && (
            <p role="alert" className="error-text">
              {error}
            </p>
          )}
        </div>
      </article>
      {preview && (
        <Modal title="Quick view" onClose={() => setPreview(false)}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Image
              src={product.imageCover}
              alt={product.title}
              width={350}
              height={400}
              className="h-80 w-full object-contain"
            />
            <div>
              <p className="text-xs text-green-600">{product.brand?.name}</p>
              <h3 className="mt-2 text-xl font-bold">{product.title}</h3>
              <div className="my-4">
                <Stars rating={product.ratingsAverage} />
              </div>
              <strong>
                {formatPrice(product.priceAfterDiscount ?? product.price)} EGP
              </strong>
              <p className="my-5 text-sm leading-6 text-gray-500">
                {product.description}
              </p>
              <Link
                href={`/products/${product._id}`}
                onClick={() => setPreview(false)}
                className="btn"
              >
                View product details
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
