"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MapPin, Settings, ShoppingBag } from "lucide-react";
import AccountShell from "../_components/account/AccountShell";

export default function ProfilePage() {
  const { data: session } = useSession();
  const details = [
    ["Full name", session?.user?.name],
    ["Email address", session?.user?.email],
    ["Phone number", session?.user?.phone],
  ];

  return (
    <AccountShell>
      <section className="panel p-7">
        <h2 className="text-xl font-bold">My Profile</h2>
        <p className="mt-2 text-gray-500">Your FreshCart account information.</p>
        <dl className="my-7 divide-y divide-gray-100 rounded-lg border border-gray-100">
          {details.map(([label, value]) => (
            <div className="flex flex-wrap justify-between gap-2 px-4 py-4" key={label}>
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-medium">{value || "—"}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3">
          <Link className="btn" href="/profile/settings"><Settings size={16} />Edit Settings</Link>
          <Link className="btn btn-outline" href="/profile/addresses"><MapPin size={16} />Addresses</Link>
          <Link className="btn btn-outline" href="/orders"><ShoppingBag size={16} />My Orders</Link>
        </div>
      </section>
    </AccountShell>
  );
}
