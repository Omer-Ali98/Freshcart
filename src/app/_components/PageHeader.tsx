import Link from "next/link";
import {
  Package,
  Layers,
  Tags,
  Heart,
  ShoppingCart,
  ClipboardList,
  User,
  Headphones,
  ShieldCheck,
  FileText,
} from "lucide-react";
export default function PageHeader({
  title,
  subtitle,
  kind,
  breadcrumb,
  back,
}: {
  title: string;
  subtitle?: string;
  kind?: "account" | "brands" | "categories" | "products" | "contact" | "privacy" | "terms";
  breadcrumb?: string;
  back?: { label: string; href: string };
}) {
  let type = kind;
  if (!type && title === "Top Brands") type = "brands";
  if (!type && title === "All Categories") type = "categories";
  if (!type && title === "All Products") type = "products";

  let Icon = Package;
  if (type === "contact") Icon = Headphones;
  else if (type === "privacy") Icon = ShieldCheck;
  else if (type === "terms") Icon = FileText;
  else if (type === "brands") Icon = Tags;
  else if (type === "categories") Icon = Layers;
  else if (type === "account") Icon = User;
  else if (title.includes("Wishlist")) Icon = Heart;
  else if (title === "Shopping Cart") Icon = ShoppingCart;
  else if (title.includes("Order")) Icon = ClipboardList;
  return (
    <div
      className={
        type
          ? `catalog-banner ${type === "brands" ? "purple" : ""}`
          : "simple-heading"
      }
    >
      <div className="container-main">
        <div
          className={`mb-5 text-xs ${type ? "text-white/70" : "text-gray-500"}`}
        >
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          {breadcrumb || title}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={
                type
                  ? "banner-icon"
                  : `flex h-12 w-12 items-center justify-center rounded-xl ${title.includes("Wishlist") ? "bg-red-50 text-red-500" : "bg-green-600 text-white"}`
              }
            >
              <Icon size={27} />
            </span>
            <div>
              <h1>{title}</h1>
              {subtitle && (
                <p
                  className={`mt-1 text-sm ${type ? "text-white/75" : "text-gray-500"}`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {back && (
            <Link className="text-sm text-green-600" href={back.href}>
              ← {back.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
