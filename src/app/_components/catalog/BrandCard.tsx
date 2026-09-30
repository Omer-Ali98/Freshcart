import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/api/types/productType";
export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/search?brand=${brand._id}`}
      className="group rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:border-purple-200 hover:shadow-md"
    >
      <div className="flex h-36 items-center justify-center rounded-lg bg-gray-50/70">
        <Image
          src={brand.image}
          alt={brand.name}
          width={160}
          height={120}
          className="max-h-28 w-full object-contain"
        />
      </div>
      <h3 className="mt-5 text-sm font-medium">{brand.name}</h3>
      <span className="mt-2 block text-xs text-purple-600 opacity-0 group-hover:opacity-100 group-focus:opacity-100">
        View Products →
      </span>
    </Link>
  );
}
