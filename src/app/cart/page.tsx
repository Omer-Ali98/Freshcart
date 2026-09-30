"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Lock,
  Truck,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useEffect, useState, FormEvent } from "react";
import PageHeader from "../_components/PageHeader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
  applyCoupon,
} from "@/store/cartSlice";
import { formatPrice } from "@/lib/format";
import { notify } from "@/lib/notify";
export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cart, isLoading, error } = useAppSelector((s) => s.cart);
  const [promo, setPromo] = useState(false);
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);
  const products = cart?.data?.products || [];
  const subtotal = cart?.data.totalCartPrice ?? 0;
  const total = cart?.data.totalPriceAfterDiscount ?? subtotal;
  const discount = Math.max(0, subtotal - total);
  const id = cart?.cartId || cart?.data._id;
  async function coupon(e: FormEvent) {
    e.preventDefault();
    setNotice("");
    try {
      await dispatch(applyCoupon(code)).unwrap();
      setNotice("Promo code applied successfully.");
      notify("Promo code applied successfully.");
    } catch {
      /* Redux renders the API error below. */
    }
  }
  return (
    <section className="bg-gray-50/70">
      <PageHeader
        title="Shopping Cart"
        subtitle={`You have ${products.length} items in your cart`}
      />
      <div className="container-main pb-16">
        {error && (
          <p role="alert" className="feedback feedback-error mb-5">
            {error}
            <button
              onClick={() => dispatch(getCart())}
              className="ml-3 underline"
            >
              Retry
            </button>
          </p>
        )}
        {isLoading && !cart ? (
          <p role="status" className="py-24 text-center">
            Loading cart...
          </p>
        ) : products.length ? (
          <div className="checkout-grid">
            <div>
              <div className="space-y-4">
                {products.map((item) => (
                  <article
                    className="panel flex items-center gap-5 p-5 max-md:items-start max-md:gap-3"
                    key={item._id}
                  >
                    <div className="shrink-0 text-center">
                      <Link href={`/products/${item.product._id}`}>
                        <Image
                          src={item.product.imageCover}
                          alt={item.product.title}
                          width={120}
                          height={130}
                          className="h-28 w-28 rounded-lg bg-gray-50 object-contain max-md:h-24 max-md:w-24"
                        />
                      </Link>
                      <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[12px] text-green-600">
                        In Stock
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.product._id}`}
                        className="font-semibold"
                      >
                        {item.product.title}
                      </Link>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="rounded-full bg-green-50 px-2 py-1 text-green-700">
                          {item.product.category?.name}
                        </span>
                        <span>
                          · SKU: {item.product._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-3 font-bold text-green-600">
                        {formatPrice(item.price)} EGP{" "}
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          per unit
                        </span>
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            disabled={isLoading || item.count <= 1}
                            aria-label={`Decrease quantity of ${item.product.title}`}
                            onClick={() =>
                              dispatch(
                                updateCartItem({
                                  productId: item.product._id,
                                  count: item.count - 1,
                                }),
                              ).unwrap().then(() => notify("Cart quantity updated")).catch(() => { })
                            }
                            className="rounded-md border border-gray-100 bg-gray-50 p-2"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="min-w-5 text-center font-bold">
                            {item.count}
                          </span>
                          <button
                            disabled={
                              isLoading ||
                              (item.product.quantity !== undefined &&
                                item.count >= item.product.quantity)
                            }
                            aria-label={`Increase quantity of ${item.product.title}`}
                            onClick={() =>
                              dispatch(
                                updateCartItem({
                                  productId: item.product._id,
                                  count: item.count + 1,
                                }),
                              ).unwrap().then(() => notify("Cart quantity updated")).catch(() => { })
                            }
                            className="rounded-md bg-green-600 p-2 text-white"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="block text-xs text-gray-400">
                              Total
                            </span>
                            <strong>
                              {formatPrice(item.count * item.price)} EGP
                            </strong>
                          </div>
                          <button
                            disabled={isLoading}
                            aria-label={`Remove ${item.product.title}`}
                            onClick={() =>
                              dispatch(removeCartItem(item.product._id)).unwrap().then(() => notify("Item removed from cart")).catch(() => { })
                            }
                            className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-500"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-6 flex justify-between text-xs">
                <Link href="/products" className="text-green-600">
                  ← Continue Shopping
                </Link>
                <button
                  disabled={isLoading}
                  onClick={() => {
                    if (window.confirm("Remove all items from your cart?"))
                      dispatch(clearCart()).unwrap().then(() => notify("Cart cleared")).catch(() => { });
                  }}
                  className="text-gray-400"
                >
                  Clear all items
                </button>
              </div>
            </div>
            <aside className="panel h-fit md:sticky md:top-5">
              <div className="panel-title">
                <h2 className="flex items-center gap-2">
                  <ShoppingBag size={20} />
                  Order Summary
                </h2>
                <p>{products.length} items in your cart</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                  <Truck className="text-green-600" size={23} />
                  <div>
                    <strong className="text-sm text-green-600">
                      {total >= 500 ? "Free Shipping!" : "Delivery"}
                    </strong>
                    <p className="mt-1 text-xs text-gray-500">
                      {total >= 500
                        ? "You qualify for free delivery"
                        : "Shipping confirmed at checkout"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4 border-b border-gray-100 pb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatPrice(subtotal)} EGP</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>−{formatPrice(discount)} EGP</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-xs text-green-600">
                      {total >= 500 ? "FREE" : "At checkout"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between py-5">
                  <strong>Total</strong>
                  <strong className="text-xl">
                    {formatPrice(total)}{" "}
                    <small className="text-xs font-normal">EGP</small>
                  </strong>
                </div>
                <button
                  onClick={() => setPromo(!promo)}
                  aria-expanded={promo}
                  className="btn btn-outline mb-4 w-full text-xs!"
                >
                  <Tag size={14} />
                  Apply Promo Code
                </button>
                {promo && (
                  <form onSubmit={coupon} className="mb-5 flex gap-2">
                    <input
                      className="field flex-1"
                      aria-label="Promo code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      placeholder="Promo code"
                    />
                    <button disabled={isLoading} className="btn px-3!">
                      Apply
                    </button>
                  </form>
                )}
                {notice && (
                  <p role="status" className="feedback mb-4">
                    {notice}
                  </p>
                )}
                <Link
                  href={`/checkout/${id}`}
                  aria-disabled={isLoading}
                  onClick={(e) => {
                    if (isLoading) e.preventDefault();
                  }}
                  className="btn w-full"
                >
                  <Lock size={16} />
                  Secure Checkout
                </Link>
                <div className="mt-5 flex justify-center gap-4 text-[12px] text-gray-400">
                  <span className="flex gap-1">
                    <ShieldCheck size={12} className="text-green-600" />
                    Secure Payment
                  </span>
                  <span className="flex gap-1">
                    <Truck size={12} className="text-blue-500" />
                    Fast Delivery
                  </span>
                </div>
                <Link
                  href="/products"
                  className="mt-6 block text-center text-xs text-green-600"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          !error && (
            <div className="py-24 text-center">
              <ShoppingBag className="mx-auto text-gray-300" size={52} />
              <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
              <p className="mt-3 text-gray-500">
                Add some products and they will appear here.
              </p>
              <Link className="btn mt-6" href="/products">
                Continue Shopping
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  );
}
