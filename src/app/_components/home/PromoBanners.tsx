import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
export default function PromoBanners() {
  return (
    <section className="container-main grid gap-6 pb-16 md:grid-cols-2">
      {[
        {
          title: "Fresh Organic Fruits",
          text: "Get up to 40% off on selected organic fruits",
          tag: "Deal of the Day",
          offer: "40%",
          code: "ORGANIC40",
          action: "Shop Now",
          color: "from-emerald-500 to-emerald-700",
          Icon: Flame,
        },
        {
          title: "Exotic Vegetables",
          text: "Discover our latest collection of premium vegetables",
          tag: "New Arrivals",
          offer: "25%",
          code: "FRESH25",
          action: "Explore Now",
          color: "from-orange-500 to-rose-500",
          Icon: Sparkles,
        },
      ].map(({ title, text, tag, offer, code, action, color, Icon }) => (
        <div
          key={title}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br p-8 text-white ${color}`}
        >
          <span className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/10" />
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs">
            <Icon size={12} />
            {tag}
          </span>
          <h3 className="mt-4 text-2xl font-bold">{title}</h3>
          <p className="mt-2 text-sm text-white/90">{text}</p>
          <div className="mt-4 flex items-center gap-4">
            <strong className="text-3xl">{offer} OFF</strong>
            <span className="text-xs">Use code: {code}</span>
          </div>
          <Link
            href="/products"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-700"
          >
            {action}
            <ArrowRight size={14} />
          </Link>
        </div>
      ))}
    </section>
  );
}
