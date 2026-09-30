"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
const slides = [
  [
    "Fresh Products Delivered to your Door",
    "Get 20% off your first order",
    "Shop Now",
    "View Deals",
  ],
  [
    "Premium Quality Guaranteed",
    "Fresh from farm to your table",
    "Shop Now",
    "Learn More",
  ],
  [
    "Fast & Free Delivery",
    "Same day delivery available",
    "Order Now",
    "Delivery Info",
  ],
];
export default function HeroSlider() {
  return (
    <section className="home-hero">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 6000,
          pauseOnMouseEnter: true,
          disableOnInteraction: true,
        }}
        pagination={{ clickable: true }}
        navigation
        loop
      >
        {slides.map(([title, text, action, second], i) => (
          <SwiperSlide key={title}>
            <div className="relative flex h-[400px] items-center overflow-hidden max-md:h-[500px]">
              <Image
                src="/reference/hero-market.png"
                alt="Fresh vegetables at the market"
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-emerald-700/50" />
              <div className="container-main relative z-10 text-white">
                <h1 className="max-w-[530px] text-4xl font-bold leading-tight max-md:text-[32px]">
                  {title}
                </h1>
                <p className="mt-5 text-lg">{text}</p>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/products"
                    className="rounded-lg bg-white px-6 py-3 font-semibold text-green-600"
                  >
                    {action}
                  </Link>
                  <Link
                    href={
                      i === 0
                        ? "/search?sort=price"
                        : i === 1
                          ? "/categories"
                          : "/support#shipping"
                    }
                    className="rounded-lg border border-white/60 px-6 py-3 font-semibold"
                  >
                    {second}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .home-hero .swiper-button-prev,
        .home-hero .swiper-button-next {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ffffffcc;
          color: #16a34a;
          padding: 13px;
        }
        .home-hero .swiper-pagination-bullet {
          background: white;
          opacity: 0.45;
        }
        .home-hero .swiper-pagination-bullet-active {
          width: 26px;
          border-radius: 8px;
          opacity: 1;
        }
        @media (max-width: 767px) {
          .home-hero .swiper-button-prev,
          .home-hero .swiper-button-next {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
