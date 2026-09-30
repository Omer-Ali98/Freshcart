import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  ShoppingBag,
  Package,
} from "lucide-react";
import PageHeader from "../_components/PageHeader";
import { getUserOrders } from "@/api/actions/order.actions";
import { formatPrice } from "@/lib/format";
import OrderPlacedNotice from "../_components/OrderPlacedNotice";
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ placed?: string }>;
}) {
  const { placed } = await searchParams;
  const orders = await getUserOrders();
  return (
    <section className="bg-gray-50/50">
      <PageHeader
        title="My Orders"
        subtitle={`Track and manage your ${orders.length} orders`}
        back={{ label: "Continue Shopping", href: "/products" }}
      />
      <div className="container-main pb-16">
        {placed && <OrderPlacedNotice />}
        {placed && (
          <p role="status" className="feedback mb-6">
            Your order has been placed successfully.
          </p>
        )}
        {orders.length ? (
          orders.map((o, index) => (
            <details className="order-row" key={o._id} open={index === 0}>
              <summary>
                <div className="relative shrink-0">
                  {o.cartItems?.[0] && (
                    <Image
                      src={o.cartItems[0].product.imageCover}
                      alt={o.cartItems[0].product.title}
                      width={85}
                      height={85}
                      className="h-20 w-20 rounded-lg bg-gray-50 object-contain"
                    />
                  )}
                  {o.cartItems.length > 1 && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-gray-900 px-1.5 py-1 text-[12px] text-white">
                      +{o.cartItems.length - 1}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={`rounded-full px-2 py-1 text-[12px] ${o.isDelivered ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}
                  >
                    ● {o.isDelivered ? "Delivered" : "Processing"}
                  </span>
                  <p className="mt-3 font-bold">
                    <span className="mr-2 text-gray-400">#</span>
                    {o.id || o._id.slice(-8).toUpperCase()}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>
                      {new Date(o.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>
                      · {o.cartItems.length}{" "}
                      {o.cartItems.length === 1 ? "item" : "items"}
                    </span>
                    <span>· {o.shippingAddress?.city}</span>
                  </div>
                  <strong className="mt-3 block">
                    {formatPrice(o.totalOrderPrice)}{" "}
                    <small className="text-[12px] font-normal text-gray-400">
                      EGP
                    </small>
                  </strong>
                </div>
                <div className="flex self-stretch flex-col items-end justify-between gap-4">
                  <span
                    title={`${o.paymentMethodType} · ${o.isPaid ? "Paid" : "Payment pending"}`}
                    className={`rounded-lg p-2 ${o.isPaid ? "bg-purple-50 text-purple-600" : "bg-gray-50 text-gray-500"}`}
                  >
                    {o.paymentMethodType === "cash" ? (
                      <Truck size={17} />
                    ) : (
                      <CreditCard size={17} />
                    )}
                  </span>
                  <span className="show-label rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500" />
                </div>
              </summary>
              <div className="border-t border-gray-100 bg-gray-50/40 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
                  <ShoppingBag size={15} className="text-green-600" />
                  Order Items
                </h3>
                {o.cartItems.map((i) => (
                  <Link
                    href={`/products/${i.product._id}`}
                    key={i._id}
                    className="mb-3 flex items-center gap-4 rounded-lg bg-white p-3"
                  >
                    <Image
                      src={i.product.imageCover}
                      alt={i.product.title}
                      width={55}
                      height={60}
                      className="h-14 w-12 object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{i.product.title}</p>
                      <span className="mt-1 block text-xs text-gray-400">
                        {i.count} × {formatPrice(i.price)} EGP
                      </span>
                    </div>
                    <strong className="text-sm">
                      {formatPrice(i.count * i.price)}{" "}
                      <small className="text-[12px] font-normal text-gray-400">
                        EGP
                      </small>
                    </strong>
                  </Link>
                ))}
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div className="text-xs text-gray-500">
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
                      <MapPin size={16} className="text-blue-500" />
                      Delivery Address
                    </h3>
                    <p className="font-semibold">{o.shippingAddress?.city}</p>
                    <p className="mt-2">{o.shippingAddress?.details}</p>
                    <p className="mt-3 flex items-center gap-1">
                      <Phone size={12} />
                      {o.shippingAddress?.phone}
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs">
                    <h3 className="mb-4 font-bold text-amber-700">
                      Order Summary
                    </h3>
                    <div className="mb-3 flex justify-between">
                      <span>Payment</span>
                      <span>
                        {o.paymentMethodType === "cash"
                          ? "Cash on Delivery"
                          : "Online"}{" "}
                        · {o.isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-amber-100 pt-3 font-bold">
                      <span>Total</span>
                      <span>{formatPrice(o.totalOrderPrice)} EGP</span>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          ))
        ) : (
          <div className="py-24 text-center">
            <Package size={50} className="mx-auto text-gray-300" />
            <h2 className="mt-5 text-xl font-bold">No orders yet</h2>
            <p className="mt-3 text-gray-500">
              Your orders will appear here after checkout.
            </p>
            <Link href="/products" className="btn mt-6">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
