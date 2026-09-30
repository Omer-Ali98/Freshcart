import PageHeader from "@/app/_components/PageHeader";
import CategoryCard from "@/app/_components/catalog/CategoryCard";

import { getCategories } from "@/api/services/catalogApi";

export default async function CategoriesPage() {
  const categories = await getCategories(50);
  return (
    <>
      <PageHeader
        title="All Categories"
        subtitle="Browse our wide range of product categories"
      />
      <section className="container-main categories-grid page-space">
        {categories.data.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </section>
    </>
  );
}
