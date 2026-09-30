import { getCategories } from "@/api/services/catalogApi";
import { getProducts } from "@/api/services/productApi";
import HeroSlider from "@/app/_components/home/HeroSlider";
import HomeCategories from "@/app/_components/home/HomeCategories";
import PromoBanners from "@/app/_components/home/PromoBanners";
import FeaturedProducts from "@/app/_components/home/FeaturedProducts";
import NewsletterSection from "@/app/_components/home/NewsletterSection";
import ServiceFeatures from "@/app/_components/ServiceFeatures";

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(12),
    getProducts({ limit: "40" }),
  ]);

  return (
    <>
      <HeroSlider />
      <ServiceFeatures hero />
      <HomeCategories categories={categories.data} />
      <PromoBanners />
      <FeaturedProducts products={products.data} />
      <NewsletterSection />
    </>
  );
}
