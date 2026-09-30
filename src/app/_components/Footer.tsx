import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/freshcart-logo.svg";
import ServiceFeatures from "./ServiceFeatures";
export default function Footer() {
  return (
    <>
      <ServiceFeatures />
      <footer className="site-footer">
        <div className="container-main footer-grid">
          <div className="footer-about">
            <Link
              href="/"
              className="mb-6 inline-block! rounded bg-white px-3 py-2"
            >
              <Image src={logo} alt="FreshCart" width={160} height={32} />
            </Link>
            <p className="max-w-md text-[13px] leading-6">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at
              competitive prices with a seamless shopping experience.
            </p>
            <div className="mt-6 space-y-3 text-xs">
              <a href="tel:+18001234567" className="flex! items-center gap-3">
                <Phone size={15} className="text-green-500" />
                +1 (800) 123-4567
              </a>
              <a
                href="mailto:support@freshcart.com"
                className="flex! items-center gap-3"
              >
                <Mail size={15} className="text-green-500" />
                support@freshcart.com
              </a>
              <p className="flex items-start gap-3">
                <MapPin size={15} className="shrink-0 text-green-500" />
                123 Commerce Street, New York, NY 10001
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              {["f", "𝕏", "◎", "▶"].map((label) => (
                <span
                  key={label}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs"
                  aria-hidden="true"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <Column
            title="Shop"
            links={[
              ["All Products", "/products"],
              ["Categories", "/categories"],
              ["Brands", "/brands"],
              ["Electronics", "/search?category=6439d2d167d9aa4ca970649f"],
              ["Men's Fashion", "/search?keyword=Men"],
              ["Women's Fashion", "/search?keyword=Woman"],
            ]}
          />
          <Column
            title="Account"
            links={[
              ["My Account", "/profile/settings"],
              ["Order History", "/orders"],
              ["Wishlist", "/wishlist"],
              ["Shopping Cart", "/cart"],
              ["Sign In", "/login"],
              ["Create Account", "/register"],
            ]}
          />
          <Column
            title="Support"
            links={[
              ["Contact Us", "/contact"],
              ["Help Center", "/support#help"],
              ["Shipping Info", "/support#shipping"],
              ["Returns & Refunds", "/support#returns"],
              ["Track Order", "/orders"],
            ]}
          />
          <Column
            title="Legal"
            links={[
              ["Privacy Policy", "/privacy"],
              ["Terms of Service", "/terms"],
              ["Cookie Policy", "/cookies"],
            ]}
          />
        </div>
        <div className="border-t border-white/10">
          <div className="container-main flex flex-wrap items-center justify-between gap-4 py-6 text-xs">
            <span>© 2026 FreshCart. All rights reserved.</span>
            <div className="flex gap-4">
              <span>▰ Visa</span>
              <span>● Mastercard</span>
              <span>▰ PayPal</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
function Column({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3>{title}</h3>
      {links.map(([text, href]) => (
        <Link href={href} key={text}>
          {text}
        </Link>
      ))}
    </div>
  );
}
