import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/api/services/productApi";
import ProductDetailsClient from "@/app/_components/product/ProductDetailsClient";
import ProductCard from "@/app/_components/catalog/ProductCard";
export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getProduct(id);
  if (!response?.data) notFound();
  const product = response.data;
  const related = await getProducts({
    category: product.category?._id,
    limit: "6",
  }).catch(() => ({ data: [] as typeof product[] }));
  return (
    <>
      <div className="container-main flex flex-wrap gap-2 pt-6 text-xs text-gray-500">
        <Link href="/">⌂ Home</Link>
        <span>›</span>
        <Link href={`/search?category=${product.category?._id}`}>
          {product.category?.name}
        </Link>
        <span>›</span>
        <span>{product.subcategory?.[0]?.name}</span>
        <span>›</span>
        <span>{product.title}</span>
      </div>
      <ProductDetailsClient product={product} />
      <section className="container-main pb-16 pt-8">
        <h2 className="section-title mb-8">
          You May <em>Also Like</em>
        </h2>
        <div className="product-grid">
          {related.data
            .filter((p) => p._id !== id)
            .slice(0, 5)
            .map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
        </div>
      </section>
    </>
  );
}
