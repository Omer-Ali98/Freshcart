import Link from "next/link";
import ContactPage from "../contact/page";
export default function Support() {
  return (
    <>
      <ContactPage />
      <div className="container-main max-w-4xl! space-y-8 pb-16">
        <h2 className="text-xl font-bold" id="help">Quick answers</h2>
        <section className="panel p-6" id="shipping">
          <h2 className="text-xl font-bold">Shipping information</h2>
          <p className="mt-4 leading-7 text-gray-500">
            Review your delivery address and order total at checkout. For a
            delivery update, open your order history or contact support with
            your order number.
          </p>
          <Link href="/orders" className="btn mt-5">
            View My Orders
          </Link>
        </section>
        <section className="panel p-6" id="returns">
          <h2 className="text-xl font-bold">Returns & Refunds</h2>
          <p className="mt-4 leading-7 text-gray-500">
            Contact support with your order number and the product you would
            like to return. Confirm eligibility, timing and refund arrangements
            before sending an item back.
          </p>
        </section>
      </div>
    </>
  );
}
