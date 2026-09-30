"use client";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { ProductType } from "@/api/types/productType";
export function useWishlist() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();
  const key = ["wishlist", session?.user?.id];
  const query = useQuery<{ data: ProductType[] }>({
    queryKey: key,
    enabled: status === "authenticated",
    queryFn: async () => {
      const r = await fetch("/api/wishlist", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw Error(j.message || "Unable to load wishlist");
      return j;
    },
  });
  const products = query.data?.data || [];
  const mutation = useMutation({
    mutationFn: async ({ id, remove }: { id: string; remove: boolean }) => {
      if (status !== "authenticated") {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        throw Error("Please sign in to save products");
      }
      const r = await fetch(
        remove ? `/api/wishlist?productId=${id}` : "/api/wishlist",
        {
          method: remove ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          ...(!remove ? { body: JSON.stringify({ productId: id }) } : {}),
        },
      );
      const j = await r.json();
      if (!r.ok) throw Error(j.message || "Unable to update wishlist");
      return j;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
  return {
    ...query,
    products,
    mutation,
    has: (id: string) => products.some((p) => p._id === id),
    toggle: (id: string) =>
      mutation.mutateAsync({ id, remove: products.some((p) => p._id === id) }),
    remove: (id: string) => mutation.mutateAsync({ id, remove: true }),
  };
}
