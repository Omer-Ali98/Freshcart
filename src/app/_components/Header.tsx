"use client";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Heart,
  Headphones,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  Phone,
  Mail,
  Truck,
  LogOut,
  ChevronDown,
  Newspaper,
  Settings,
  MapPin,
  Package,
} from "lucide-react";
import logo from "@/assets/freshcart-logo.svg";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCart, resetCart } from "@/store/cartSlice";
import { useWishlist } from "@/hooks/useWishlist";
import type { Category } from "@/api/types/productType";
export default function Header() {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const count = useAppSelector((s) => s.cart.cart?.numOfCartItems || 0);
  const { products } = useWishlist();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    if (!accountOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountOpen]);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setCategories(data.data || []))
      .catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    if (status === "authenticated") dispatch(getCart());
    else if (status === "unauthenticated") dispatch(resetCart());
  }, [status, session?.user?.id, dispatch]);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  function search(e: FormEvent) {
    e.preventDefault();
    router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    setOpen(false);
  }
  const nav = [
    ["Home", "/"],
    ["Shop", "/products"],
    ["Categories", "/categories"],
    ["Brands", "/brands"],
  ];
  const accountLinks = [
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: Package, label: "My Orders", href: "/orders" },
    { icon: Heart, label: "My Wishlist", href: "/wishlist" },
    { icon: MapPin, label: "Addresses", href: "/profile/addresses" },
    { icon: Settings, label: "Settings", href: "/profile/settings" },
  ];
  const searchForm = (mobile = false) => (
    <form
      onSubmit={search}
      className={
        mobile
          ? "relative mb-7"
          : "relative mr-auto min-w-0 flex-1 max-lg:max-w-none"
      }
    >
      <input
        aria-label="Search products"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={
          mobile
            ? "Search products..."
            : "Search for products, brands and more..."
        }
        className="h-11 w-full rounded-full border border-gray-100 bg-gray-50 px-4 pr-12 text-xs"
      />
      <button
        aria-label="Search"
        className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-full bg-green-600 text-white"
      >
        <Search size={17} />
      </button>
    </form>
  );
  return (
    <>
      <div className="hidden border-b border-gray-100 text-[13px] text-gray-500 md:block">
        <div className="container-main flex h-[38px] items-center justify-between gap-4">
          <div className="flex gap-5">
            <span className="flex items-center gap-2">
              <Truck size={13} className="text-green-600" />
              Free Shipping on Orders 500 EGP
            </span>
            <span className="flex items-center gap-2">
              <Newspaper size={13} className="text-green-600" />
              New Arrivals Daily
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+18001234567" className="flex items-center gap-1">
              <Phone size={12} />
              +1 (800) 123-4567
            </a>
            <a
              href="mailto:support@freshcart.com"
              className="flex items-center gap-1"
            >
              <Mail size={12} />
              support@freshcart.com
            </a>
            {status === "authenticated" ? (
              <>
                <Link
                  href="/profile/settings"
                  className="flex items-center gap-1"
                >
                  <User size={12} />
                  {session?.user?.name}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1"
                >
                  <LogOut size={12} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Sign In</Link>
                <Link href="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-xs">
        <div className="container-main flex h-[78px] items-center gap-6 max-md:h-20 max-md:gap-3">
          <Link href="/" className="shrink-0">
            <Image
              src={logo}
              alt="FreshCart"
              width={165}
              height={33}
              priority
              className="h-auto w-[165px] max-md:w-[150px]"
            />
          </Link>
          <div className="hidden min-w-0 flex-1 md:block">{searchForm()}</div>
          <nav className="hidden items-center gap-6 text-[15px] font-medium xl:flex">
            {nav.map(([label, href]) =>
              label === "Categories" ? (
                <div className="group relative" key={href}>
                  <Link
                    className={`flex items-center gap-1 ${path === href ? "text-green-600" : ""}`}
                    href={href}
                  >
                    Categories
                    <ChevronDown size={12} />
                  </Link>
                  <div className="invisible absolute left-0 top-full max-h-[65vh] w-52 overflow-y-auto rounded-lg border border-gray-100 bg-white p-2 opacity-0 shadow-lg transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <Link className="block p-2" href="/categories">
                      All Categories
                    </Link>
                    {categories.filter((category) => ["Electronics", "Women's Fashion", "Men's Fashion", "Beauty & Health"].includes(category.name)).map((category) => (
                      <Link key={category._id} className="block rounded p-2 hover:bg-green-50 hover:text-green-700" href={`/search?category=${category._id}`}>
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={href}
                  className={path === href ? "text-green-600" : ""}
                  href={href}
                >
                  {label}
                </Link>
              ),
            )}
          </nav>
          <Link
            href="/contact"
            className="hidden items-center gap-2 border-r border-gray-200 pr-5 text-xs md:flex"
          >
            <Headphones size={21} className="text-green-600" />
            <span className="text-gray-500">
              Support
              <br />
              <strong className="text-gray-700">24/7 Help</strong>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-4 max-md:gap-3">
            <Link href="/wishlist" aria-label="Wishlist" className="relative">
              <Heart size={23} className="text-gray-600" />
              {status === "authenticated" && products.length > 0 && (
                <Badge count={products.length} red />
              )}
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative">
              <ShoppingCart size={23} className="text-gray-600" />
              {status === "authenticated" && count > 0 && (
                <Badge count={count} />
              )}
            </Link>
            {status === "authenticated" ? (
              <div className="relative hidden md:block" ref={accountRef}>
                <button aria-label="Account menu" aria-expanded={accountOpen} aria-haspopup="menu" onClick={() => setAccountOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full text-gray-600 hover:bg-green-50 hover:text-green-700">
                  <User size={23} />
                </button>
                {accountOpen && (
                  <div role="menu" aria-label="Account" className="absolute right-0 top-[calc(100%+12px)] z-50 w-60 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                    <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 font-semibold"><span className="rounded-full bg-green-50 p-2 text-green-600"><User size={20} /></span><span className="truncate">{session?.user?.name}</span></div>
                    <div className="py-2">
                      {accountLinks.map(({ icon: Icon, label, href }) => (
                        <Link
                          role="menuitem"
                          onClick={() => setAccountOpen(false)}
                          href={href}
                          key={href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-700"
                        >
                          <Icon size={17} />{label}
                        </Link>
                      ))}
                    </div>
                    <button role="menuitem" onClick={() => signOut({ callbackUrl: "/" })} className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"><LogOut size={17} />Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-1 rounded-full bg-green-600 px-4 py-2 text-xs text-white md:flex"
              >
                <User size={14} />
                Sign In
              </Link>
            )}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full bg-green-600 text-white xl:hidden"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div
          className="fixed inset-0 z-[80] bg-black/20"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="ml-auto h-full w-[min(340px,90vw)] overflow-auto bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)}>
                <Image src={logo} alt="FreshCart" width={150} height={30} />
              </Link>
              <button
                autoFocus
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gray-50 p-2"
              >
                <X size={18} />
              </button>
            </div>
            {searchForm(true)}
            <nav className="grid gap-2">
              {nav.map(([label, href]) => (
                <Link
                  href={href}
                  key={href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-4 ${path === href ? "bg-green-50 text-green-600" : ""}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="my-6 border-y border-gray-100 py-4">
              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-4"
              >
                <Heart size={19} className="text-red-500" />
                Wishlist
                {products.length > 0 && (
                  <span className="ml-auto rounded-full bg-red-500 px-2 text-xs text-white">
                    {products.length}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-4"
              >
                <ShoppingCart size={19} className="text-green-600" />
                Cart
                {count > 0 && (
                  <span className="ml-auto rounded-full bg-green-600 px-2 text-xs text-white">
                    {count}
                  </span>
                )}
              </Link>
            </div>
            {status === "authenticated" ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-4"
                >
                  <User size={18} />
                  {session?.user?.name}
                </Link>
                <Link href="/orders" onClick={() => setOpen(false)} className="flex items-center gap-3 p-4"><Package size={18} />My Orders</Link>
                <Link href="/profile/addresses" onClick={() => setOpen(false)} className="flex items-center gap-3 p-4"><MapPin size={18} />Addresses</Link>
                <Link href="/profile/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 p-4"><Settings size={18} />Settings</Link>
                <button
                  className="flex items-center gap-3 p-4 text-red-500"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  onClick={() => setOpen(false)}
                  href="/login"
                  className="btn"
                >
                  Sign In
                </Link>
                <Link
                  onClick={() => setOpen(false)}
                  href="/register"
                  className="btn btn-outline"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <Link
              href="/support"
              onClick={() => setOpen(false)}
              className="mt-6 flex items-center gap-3 rounded-xl bg-gray-50 p-4"
            >
              <Headphones className="text-green-600" />
              <span className="text-sm">
                Need Help?
                <br />
                <span className="text-xs text-green-600">Contact Support</span>
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
function Badge({ count, red = false }: { count: number; red?: boolean }) {
  return (
    <span
      className={`absolute -right-2 -top-2 min-w-4 rounded-full px-1 text-center text-[12px] leading-4 text-white ${red ? "bg-red-500" : "bg-green-600"}`}
    >
      {count}
    </span>
  );
}
