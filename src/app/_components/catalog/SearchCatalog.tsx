"use client";
import { useState, FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Category, Brand, ProductsResponse } from "@/api/types/productType";
import { ProductParams } from "@/api/services/productApi";
import ProductCard from "./ProductCard";
export default function SearchCatalog({
  products,
  categories,
  brands,
  params,
}: {
  products: ProductsResponse;
  categories: Category[];
  brands: Brand[];
  params: ProductParams;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [filters, setFilters] = useState(false);
  const [list, setList] = useState(false);
  const [keyword, setKeyword] = useState(params.keyword || "");
  const [min, setMin] = useState(params.min || "");
  const [max, setMax] = useState(params.max || "");
  function href(changes: Record<string, string>) {
    const query = new URLSearchParams();
    Object.entries({ ...params, ...changes }).forEach(([k, v]) => {
      if (v) query.set(k, v);
    });
    return `/search?${query}`;
  }
  function update(changes: Record<string, string>) {
    start(() =>
      router.push(href({ page: "1", ...changes }), { scroll: false }),
    );
  }
  function search(e: FormEvent) {
    e.preventDefault();
    update({ keyword });
  }
  function check(key: "category" | "brand", id: string) {
    const ids = (params[key] || "").split(",").filter(Boolean);
    update({
      [key]: ids.includes(id)
        ? ids.filter((i) => i !== id).join(",")
        : [...ids, id].join(","),
    });
  }
  const pages = products.metadata?.numberOfPages || 1;
  const page = products.metadata?.currentPage || Number(params.page) || 1;
  return (
    <section className="bg-gray-50/60">
      <div className="container-main page-space">
        <p className="mb-6 text-xs text-gray-500">
          <Link href="/">Home</Link> / Search Results
        </p>
        <form onSubmit={search} className="relative mb-8 max-w-2xl">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            className="field pl-11!"
            aria-label="Search for products"
            placeholder="Search for products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button className="sr-only">Search</button>
        </form>
        <div className="search-layout">
          <button
            className="mobile-filter-toggle btn btn-outline mb-4"
            onClick={() => setFilters(!filters)}
            aria-expanded={filters}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
          <aside
            className={`search-sidebar ${filters ? "open" : ""}`}
            aria-label="Product filters"
          >
            <div className="flex justify-between">
              <strong>Filters</strong>
              <Link
                href="/search"
                onClick={() => {
                  setMin("");
                  setMax("");
                  setKeyword("");
                }}
                className="text-xs text-green-600"
              >
                Clear all
              </Link>
            </div>
            <div>
              <h3>Categories</h3>
              {categories.map((c) => (
                <label key={c._id}>
                  <input
                    type="checkbox"
                    checked={(params.category || "").split(",").includes(c._id)}
                    onChange={() => check("category", c._id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
            <div>
              <h3>Price Range</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  update({ min, max });
                }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <label className="block!">
                    <span className="mb-2 block text-xs">Min (EGP)</span>
                    <input
                      type="number"
                      min="0"
                      aria-label="Minimum price"
                      value={min}
                      onChange={(e) => setMin(e.target.value)}
                      placeholder="0"
                      className="field"
                    />
                  </label>
                  <label className="block!">
                    <span className="mb-2 block text-xs">Max (EGP)</span>
                    <input
                      type="number"
                      min={min || 0}
                      aria-label="Maximum price"
                      value={max}
                      onChange={(e) => setMax(e.target.value)}
                      placeholder="No limit"
                      className="field"
                    />
                  </label>
                </div>
                <button className="mt-2 w-full rounded border border-gray-200 py-2 text-xs">
                  Apply price
                </button>
              </form>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[500, 1000, 5000, 10000].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setMax(String(n));
                      setMin("");
                      update({ min: "", max: String(n) });
                    }}
                    className="rounded bg-gray-100 px-2 py-2 text-[13px]"
                  >
                    Under {n >= 1000 ? `${n / 1000}K` : n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3>Brands</h3>
              <div className="max-h-[420px] overflow-y-auto">
                {brands.map((b) => (
                  <label key={b._id}>
                    <input
                      type="checkbox"
                      checked={(params.brand || "").split(",").includes(b._id)}
                      onChange={() => check("brand", b._id)}
                    />
                    {b.name}
                  </label>
                ))}
              </div>
            </div>
          </aside>
          <div aria-busy={pending} className={pending ? "opacity-60" : ""}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-1">
                <button
                  onClick={() => setList(false)}
                  aria-label="Grid view"
                  aria-pressed={!list}
                  className={`rounded p-2 ${!list ? "bg-green-600 text-white" : "bg-white text-gray-500"}`}
                >
                  <LayoutGrid size={19} />
                </button>
                <button
                  onClick={() => setList(true)}
                  aria-label="List view"
                  aria-pressed={list}
                  className={`rounded p-2 ${list ? "bg-green-600 text-white" : "bg-white text-gray-500"}`}
                >
                  <List size={19} />
                </button>
              </div>
              <label className="flex items-center gap-3 text-xs text-gray-400">
                Sort by:
                <select
                  className="field w-40! text-gray-600"
                  aria-label="Sort products"
                  value={params.sort || ""}
                  onChange={(e) => update({ sort: e.target.value })}
                >
                  <option value="">Relevance</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ratingsAverage">Top Rated</option>
                  <option value="-createdAt">Newest</option>
                </select>
              </label>
            </div>
            {params.keyword && (
              <p className="mb-5 text-sm text-gray-500">
                Results for “{params.keyword}”{" "}
                <button
                  aria-label="Clear search"
                  onClick={() => {
                    setKeyword("");
                    update({ keyword: "" });
                  }}
                >
                  <X size={13} className="inline" />
                </button>
              </p>
            )}
            {products.data.length ? (
              <div className={`product-grid ${list ? "list-view" : ""}`}>
                {products.data.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-white py-20 text-center">
                <h2 className="text-xl font-bold">No products found</h2>
                <p className="mt-3 text-gray-500">
                  Try another search or clear your filters.
                </p>
                <Link href="/search" className="btn mt-5">
                  Clear filters
                </Link>
              </div>
            )}
            {pages > 1 && (
              <nav
                aria-label="Search result pages"
                className="mt-8 flex flex-wrap justify-center gap-2"
              >
                {page > 1 && (
                  <Link
                    aria-label="Previous page"
                    className="p-2"
                    href={href({ page: String(page - 1) })}
                  >
                    <ChevronLeft size={17} />
                  </Link>
                )}
                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter(
                    (n) => n === 1 || n === pages || Math.abs(n - page) <= 2,
                  )
                  .map((n, i, arr) => (
                    <span className="flex items-center" key={n}>
                      {i > 0 && n - arr[i - 1] > 1 && (
                        <span className="px-2">…</span>
                      )}
                      <Link
                        aria-current={n === page ? "page" : undefined}
                        href={href({ page: String(n) })}
                        className={`rounded px-3 py-2 text-xs ${n === page ? "bg-green-600 text-white" : "text-gray-500"}`}
                      >
                        {n}
                      </Link>
                    </span>
                  ))}
                {page < pages && (
                  <Link
                    aria-label="Next page"
                    className="p-2"
                    href={href({ page: String(page + 1) })}
                  >
                    <ChevronRight size={17} />
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
