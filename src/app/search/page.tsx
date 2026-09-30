import { getProducts, ProductParams } from "@/api/services/productApi";
import { getCategories, getBrands } from "@/api/services/catalogApi";
import SearchCatalog from "../_components/catalog/SearchCatalog";
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<ProductParams>;
}) {
  const params = await searchParams;
  const [products, categories, brands] = await Promise.all([
    getProducts({ ...params, limit: "12" }),
    getCategories(),
    getBrands(),
  ]);
  return (
    <SearchCatalog
      products={products}
      categories={categories.data}
      brands={brands.data}
      params={params}
    />
  );
}
