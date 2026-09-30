"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Settings, ChevronRight, User, Package } from "lucide-react";
import { ReactNode } from "react";
import PageHeader from "../PageHeader";
export default function AccountShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const menuItems = [
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: Package, label: "My Orders", href: "/orders" },
    { icon: MapPin, label: "My Addresses", href: "/profile/addresses" },
    { icon: Settings, label: "Settings", href: "/profile/settings" },
  ];
  return (
    <>
      <PageHeader
        kind="account"
        title="My Account"
        subtitle="Manage your addresses and account settings"
      />
      <section className="bg-gray-50/60">
        <div className="container-main account-grid page-space min-h-[720px]">
          <aside className="panel account-menu h-fit">
            <h2 className="border-b border-gray-100 p-4 font-bold">
              My Account
            </h2>
            <div className="p-2">
              {menuItems.map(({ icon: Icon, label, href }) => {
                return (
                  <Link
                    href={href}
                    key={href}
                    className={path === href ? "active" : ""}
                  >
                    <Icon size={18} />
                    {label}
                    <ChevronRight size={15} className="ml-auto" />
                  </Link>
                );
              })}
            </div>
          </aside>
          <div>{children}</div>
        </div>
      </section>
    </>
  );
}
