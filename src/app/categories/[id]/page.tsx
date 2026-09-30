import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { getCategories, getSubcategories } from "@/api/services/catalogApi";

export default async function CategoryDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await getCategories(50);
  const category = categories.data.find((item) => item._id === id);
  if (!category) notFound();
  const subcategories = await getSubcategories(id);

  return (
    <>
      <div className="catalog-banner">
        <div className="container-main">
          <p className="mb-5 text-sm text-white/80">
            <Link href="/">Home</Link><span className="mx-2">/</span>
            <Link href="/categories">Categories</Link><span className="mx-2">/</span>
            {category.name}
          </p>
          <div className="flex items-center gap-4">
            <Image src={category.image} alt="" width={52} height={52} className="h-14 w-14 rounded-lg bg-white object-cover" />
            <div>
              <h1>{category.name}</h1>
              <p className="mt-1 text-white/80">Choose a subcategory to browse products</p>
            </div>
          </div>
        </div>
      </div>
      <section className="container-main page-space">
        <Link href="/categories" className="text-sm text-gray-500 hover:text-green-700">
          ← Back to Categories
        </Link>
        <h2 className="mb-5 mt-7 font-bold">
          {subcategories.results} Subcategories in {category.name}
        </h2>
        {subcategories.results ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subcategories.data.map((item) => (
              <Link
                href={`/search?category=${id}&subcategory=${item._id}`}
                key={item._id}
                className="min-h-36 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-green-300 hover:shadow-md"
              >
                <span className="mb-4 inline-flex rounded-lg bg-green-50 p-3 text-green-600">
                  <FolderOpen size={21} />
                </span>
                <h3 className="font-semibold">{item.name}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="panel p-8 text-center">
            <p>No subcategories are available for this category yet.</p>
            <Link href={`/search?category=${id}`} className="btn mt-5">
              Browse all products
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
