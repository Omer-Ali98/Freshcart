import Image from "next/image";
import Link from "next/link";
import notFoundImg from "@/assets/404.png";

export default function NotFound() {
  return (
    <section className="container-main flex min-h-[65vh] flex-col items-center justify-center py-14 text-center">
      <Image
        src={notFoundImg}
        alt="Page not found"
        className="max-h-72 w-auto object-contain"
      />
      <h1 className="mt-5 text-3xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white"
      >
        Back to Home
      </Link>
    </section>
  );
}
