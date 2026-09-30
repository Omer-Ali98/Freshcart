import PageHeader from "@/app/_components/PageHeader";
import BrandCard from "@/app/_components/catalog/BrandCard";

import { getBrands } from "@/api/services/catalogApi";

export default async function BrandsPage() {
  const brands = await getBrands(50);
  return (
    <>
      <PageHeader
        title="Top Brands"
        subtitle="Shop from your favorite brands"
      />
      <section className="container-main brands-grid page-space">
        {brands.data.map((brand) => (
          <BrandCard key={brand._id} brand={brand} />
        ))}
      </section>
    </>
  );
}
