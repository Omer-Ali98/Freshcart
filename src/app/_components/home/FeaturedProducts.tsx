import { ProductType } from "@/api/types/productType";
import ProductCard from "../catalog/ProductCard";
export default function FeaturedProducts({
  products,
}: {
  products: ProductType[];
}) {
  return (
    <section className="container-main pb-16">
      <h2 className="section-title mb-10">
        Featured <em>Products</em>
      </h2>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
