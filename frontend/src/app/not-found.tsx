"use client";

import Link from "next/link";
import { categories } from "@/lib/categories";
import { CategoryIcon, getCategoryColor } from "@/components/icons/CategoryIcon";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-16 text-center">
      {/* 404 Header */}
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-slate-900 sm:text-7xl">{t.notFound.title}</h1>
        <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">
          {t.notFound.heading}
        </h2>
        <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg">
          {t.notFound.description}
        </p>
      </div>

      {/* Call to Action */}
      <div className="space-y-3">
        <p className="text-lg font-semibold text-slate-900">
          {t.notFound.ctaTitle}
        </p>
        <p className="text-sm text-slate-600">
          {t.notFound.ctaDescription}
        </p>
      </div>

      {/* All Categories Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">
          {t.notFound.exploreTitle}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-slate-200"
            >
              <div
                className={
                  "mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-xl border text-base " +
                  getCategoryColor(category.slug)
                }
              >
                <CategoryIcon category={{ slug: category.slug, name: category.name }} />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition">
                {category.name}
              </h4>
            </Link>
          ))}
        </div>
      </div>

      {/* Back to Home */}
      <div className="pt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          {t.notFound.backToHome}
        </Link>
      </div>
    </section>
  );
}

