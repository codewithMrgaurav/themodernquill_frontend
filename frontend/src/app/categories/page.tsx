"use client";

import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/categories";
import { useContent } from "@/contexts/ContentContext";
import { useLanguage } from "@/contexts/LanguageContext";

// Pexels images mapped to key category slugs for a magazine-style layout
const categoryImageMap: Record<string, string> = {
  technology:
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  ai: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  business:
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  marketing:
    "https://images.pexels.com/photos/1181670/pexels-photo-1181670.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  health:
    "https://images.pexels.com/photos/7578800/pexels-photo-7578800.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  travel:
    "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  finance:
    "https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  education:
    "https://images.pexels.com/photos/5905713/pexels-photo-5905713.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  lifestyle:
    "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  sports:
    "https://images.pexels.com/photos/3991871/pexels-photo-3991871.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  fashion:
    "https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  food: "https://images.pexels.com/photos/326279/pexels-photo-326279.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  photography:
    "https://images.pexels.com/photos/167832/pexels-photo-167832.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
};

const defaultCategoryImage =
  "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop";

const categoriesWithCounts = categories.map((cat) => ({
  ...cat,
  count: Math.floor(Math.random() * 300) + 100, // Placeholder counts
}));

function getCategoryImage(slug: string) {
  return categoryImageMap[slug] || defaultCategoryImage;
}

export default function CategoriesPage() {
  const { content } = useContent();
  const { t } = useLanguage();

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
          {content.categories.badge}
        </p>
        <h1 className="font-[family:var(--font-heading)] text-3xl font-semibold text-slate-900">
          {t.categories.title}
        </h1>
        <p className="text-sm text-slate-600">
          {content.categories.description}
        </p>
      </header>

      {/* Category Cards with images (magazine-style) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoriesWithCounts.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg hover:ring-orange-200"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={getCategoryImage(cat.slug)}
                alt={`${cat.name} category cover`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <span className="pointer-events-none absolute left-3 top-3 inline-flex rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
                {cat.name}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-1 px-4 py-3">
              {cat.description && (
                <p className="line-clamp-2 text-xs text-slate-600">
                  {cat.description}
                </p>
              )}
              <span className="mt-1 text-xs font-semibold text-orange-600">
                {cat.count}+ {content.categories.postsLabel}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

