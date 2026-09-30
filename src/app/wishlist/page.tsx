"use client";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import PageHeader from "../_components/PageHeader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import { formatPrice } from "@/lib/format";
import { notify } from "@/lib/notify";
export default function WishlistPage() {
  const wishlist = useWishlist();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  async function updateProduct(id: string, remove = false) {
    setBusy(id);
    setMessage("");
    try {
      if (remove) await wishlist.remove(id);
      else await dispatch(addToCart(id)).unwrap();
      setError(false);
      setMessage(remove ? "Removed from wishlist" : "Added to cart");
      notify(remove ? "Removed from wishlist" : "Added to cart");
    } catch (e) {
      setError(true);
      setMessage((e as Error).message || "Unable to update product");
    } finally {
      setBusy("");
    }
  }
  return (
    <>
      <PageHeader
        title="My Wishlist"
        breadcrumb="Wishlist"
        subtitle={`${wishlist.products.length} items saved`}
      />
      <section className="bg-gray-50/50">
        <div className="container-main min-h-[650px] pb-16 pt-3">
          {message && (
            <p
              role={error ? "alert" : "status"}
              className={`feedback mb-4 ${error ? "feedback-error" : ""}`}
            >
              {message}
            </p>
          )}
          {wishlist.isPending ? (
            <p role="status" className="py-16 text-center">
              Loading wishlist...
            </p>
          ) : wishlist.isError ? (
            <div role="alert" className="py-16 text-center">
              <p>{wishlist.error.message}</p>
              <button onClick={() => wishlist.refetch()} className="btn mt-4">
                Retry
              </button>
            </div>
          ) : wishlist.products.length ? (
            <>
              <table className="wishlist-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.products.map((p) => {
                    const inCart = cart?.data.products.some(
                      (item) => item.product._id === p._id,
                    ) ?? false;
                    return (
                      <tr key={p._id} className="bg-white">
                      <td>
                        <Link
                          href={`/products/${p._id}`}
                          className="flex items-center gap-5"
                        >
                          <Image
                            src={p.imageCover}
                            alt={p.title}
                            width={80}
                            height={80}
                            className="h-16 w-16 rounded-lg bg-gray-50 object-contain max-md:h-24 max-md:w-24"
                          />
                          <div>
                            <strong className="text-sm font-medium">
                              {p.title}
                            </strong>
                            <p className="mt-1 text-xs text-gray-400">
                              {p.category?.name}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td data-label="Price">
                        <strong className="text-sm">
                          {formatPrice(p.priceAfterDiscount ?? p.price)} EGP
                        </strong>
                        {p.priceAfterDiscount !== undefined && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(p.price)} EGP
                          </p>
                        )}
                      </td>
                      <td data-label="Status">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] ${inCart || p.quantity > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                        >
                          {inCart ? <ShoppingCart size={13} /> : <span aria-hidden="true">●</span>}
                          {inCart ? "In Cart" : p.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          {inCart ? (
                            <Link href="/cart" className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-xs text-gray-700 max-md:flex-1">
                              <Check size={16} className="text-green-600" />View Cart
                            </Link>
                          ) : (
                            <button
                              disabled={busy === p._id || p.quantity === 0}
                              className="btn px-4! text-xs! max-md:flex-1"
                              onClick={() => updateProduct(p._id)}
                            >
                              <ShoppingCart size={15} />
                              {busy === p._id ? "Please wait..." : "Add to Cart"}
                            </button>
                          )}
                          <button
                            disabled={busy === p._id}
                            aria-label={`Remove ${p.title}`}
                            onClick={() => updateProduct(p._id, true)}
                            className="rounded-lg border border-gray-100 p-3 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
              <Link
                href="/products"
                className="mt-7 inline-block text-xs text-gray-500"
              >
                ← Continue Shopping
              </Link>
            </>
          ) : (
            <div className="py-24 text-center">
              <Heart className="mx-auto text-gray-300" size={48} />
              <h2 className="mt-5 text-xl font-bold">Your wishlist is empty</h2>
              <p className="mt-3 text-gray-500">
                Save your favorite products and find them here.
              </p>
              <Link className="btn mt-6" href="/products">
                Explore Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
