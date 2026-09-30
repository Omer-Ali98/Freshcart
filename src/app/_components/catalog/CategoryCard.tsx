import Image from "next/image";
import Link from "next/link";
import { Category } from "@/api/types/productType";

export default function CategoryCard({ category }: { category: Category }) {
  return <Link
    href={`/categories/${category._id}`}
    className="group rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:border-green-200 hover:shadow-md"
  >
    <Image src={category.image} alt={category.name} width={230} height={210} className="mx-auto h-48 w-full rounded-lg object-cover max-md:h-32" />
    <h3 className="mt-4 text-base font-semibold group-hover:text-green-600">{category.name}</h3>
    <span className="mt-2 block text-sm text-green-600 opacity-0 group-hover:opacity-100 group-focus:opacity-100">View Subcategories →</span>
  </Link>;
}
