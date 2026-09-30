import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/api/types/productType";
export default function HomeCategories({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section className="container-main py-16">
      <div className="mb-10 flex items-center justify-between gap-3">
        <h2 className="section-title">
          Shop By <em>Category</em>
        </h2>
        <Link
          href="/categories"
          className="flex items-center gap-2 text-xs text-green-600"
        >
          View All Categories
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {categories.slice(0, 10).map((c) => (
          <Link
            key={c._id}
            href={`/search?category=${c._id}`}
            className="rounded-md border border-gray-200 bg-white p-4 text-center shadow-sm hover:border-green-400"
          >
            <Image
              src={c.image}
              alt={c.name}
              width={80}
              height={80}
              className="mx-auto h-20 w-20 rounded-full object-cover"
            />
            <h3 className="mt-3 text-sm font-medium">{c.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
