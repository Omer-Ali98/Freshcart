import { Headphones, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
export default function ServiceFeatures({ hero = false }: { hero?: boolean }) {
  const heroFeatures = [
    { icon: Truck, title: "Free Shipping", description: "On orders over 500 EGP" },
    { icon: ShieldCheck, title: "Secure Payment", description: "100% secure transactions" },
    { icon: RefreshCcw, title: "Easy Returns", description: "14-day return policy" },
    { icon: Headphones, title: "24/7 Support", description: "Dedicated support team" },
  ];
  const footerFeatures = [
    { icon: Truck, title: "Free Shipping", description: "On orders over 500 EGP" },
    { icon: RefreshCcw, title: "Easy Returns", description: "14-day return policy" },
    { icon: ShieldCheck, title: "Secure Payment", description: "100% secure checkout" },
    { icon: Headphones, title: "24/7 Support", description: "Contact us anytime" },
  ];
  const features = hero ? heroFeatures : footerFeatures;
  const iconColors = ["#3b82f6", "#10b981", "#f97316", "#a855f7"];
  const iconBackgrounds = ["#eff6ff", "#ecfdf5", "#fff7ed", "#faf5ff"];
  return (
    <section className={hero ? "hero-services" : "service-bar"}>
      <div className="container-main services">
        {features.map(({ icon: Icon, title, description }, index) => (
          <div className="service-item" key={title}>
            <span
              style={
                hero
                  ? {
                    color: iconColors[index],
                    background: iconBackgrounds[index],
                  }
                  : undefined
              }
            >
              <Icon size={19} />
            </span>
            <div>
              <strong>{title}</strong>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
