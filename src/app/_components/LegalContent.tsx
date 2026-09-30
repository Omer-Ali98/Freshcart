import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";
import PageHeader from "./PageHeader";

type Article = { title: string; lines: string[] };

export default function LegalContent({
  title,
  introTitle,
  intro,
  articles,
  next,
}: {
  title: "Privacy Policy" | "Terms of Service";
  introTitle: string;
  intro: string;
  articles: Article[];
  next: { label: string; href: string };
}) {
  const privacy = title === "Privacy Policy";
  const Icon = privacy ? ShieldCheck : FileText;
  return (
    <>
      <PageHeader kind={privacy ? "privacy" : "terms"} title={title} subtitle="FreshCart storefront information" />
      <div className="bg-gray-50/60">
        <div className="container-main py-12">
          <section className={`mb-8 flex items-start gap-4 rounded-xl border p-6 ${privacy ? "border-green-100 bg-green-50 text-green-900" : "border-amber-100 bg-amber-50 text-amber-900"}`}>
            <span className={`rounded-lg p-3 ${privacy ? "bg-green-600" : "bg-amber-500"} text-white`}>
              <Icon size={21} />
            </span>
            <div>
              <h2 className="font-bold">{introTitle}</h2>
              <p className="mt-2 leading-7">{intro}</p>
            </div>
          </section>
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article, index) => (
              <section key={article.title} className="panel min-h-52 p-7">
                <div className="mb-5 flex items-center gap-3">
                  <span className="rounded-xl bg-green-50 p-3 text-green-600"><Icon size={19} /></span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-green-600">Article {index + 1}</span>
                    <h2 className="font-bold">{article.title}</h2>
                  </div>
                </div>
                <ol className="space-y-3">
                  {article.lines.map((line, lineIndex) => (
                    <li key={lineIndex} className="flex gap-4 text-sm leading-6 text-gray-600">
                      <span className="font-semibold text-green-600">{index + 1}.{lineIndex + 1}</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
          <nav aria-label="Legal pages" className="mt-9 flex flex-wrap justify-between gap-4 border-t border-gray-200 pt-6">
            <Link href="/" className="btn btn-outline">← Back to Home</Link>
            <Link href={next.href} className="btn">{next.label} →</Link>
          </nav>
        </div>
      </div>
    </>
  );
}
