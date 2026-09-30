import Link from "next/link";
import PageHeader from "../_components/PageHeader";
import ProductCard from "../_components/catalog/ProductCard";
import { getProducts, ProductParams } from "@/api/services/productApi";
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductParams>;
}) {
  const params = await searchParams;
  const products = await getProducts({
    ...params,
    page: params.page || "1",
    limit: "40",
  });
  const pages = products.metadata?.numberOfPages || 1;
  return (
    <>
      <PageHeader
        title="All Products"
        subtitle="Explore our complete product collection"
      />
      <section className="bg-gray-50/60">
        <div className="container-main page-space">
          <div className="mb-6 flex justify-between text-xs text-gray-500">
            <p>Showing {products.data.length} products</p>
            {(params.category || params.brand || params.keyword) && (
              <Link className="text-green-600" href="/products">
                Clear filters
              </Link>
            )}
          </div>
          <div className="product-grid">
            {products.data.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {!products.data.length && (
            <p className="py-20 text-center text-gray-500">
              No products found.
            </p>
          )}
          {pages > 1 && (
            <nav
              aria-label="Product pages"
              className="mt-8 flex justify-center gap-3"
            >
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  aria-current={
                    String(n) === (params.page || "1") ? "page" : undefined
                  }
                  key={n}
                  href={`/products?${new URLSearchParams({ ...params, page: String(n) })}`}
                  className={`rounded px-3 py-2 ${String(n) === (params.page || "1") ? "bg-green-600 text-white" : "bg-white text-gray-500"}`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
