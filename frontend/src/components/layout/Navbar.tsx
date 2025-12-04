"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/categories";
import { LanguageDropdown } from "./LanguageDropdown";
import { useLanguage } from "@/contexts/LanguageContext";

function navLinkClass(isActive: boolean) {
  const base =
    "relative px-2 py-2 text-base font-medium border-b-2 border-transparent transition-colors";
  if (isActive) {
    return `${base} border-orange-500 text-slate-900`;
  }
  return `${base} text-slate-600 hover:text-slate-900`;
}

export function Navbar() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const isHome = pathname === "/" || pathname === "";
  const isCategories =
    pathname.startsWith("/category") || pathname.startsWith("/categories");
  const isAbout = pathname.startsWith("/about");
  const isContact = pathname.startsWith("/contact");
  const isLogin = pathname.startsWith("/login");

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-2xl shadow-sm ring-1 ring-orange-200/70">
            <Image
              src="/blog-logo.svg"
              alt="The Modern Quill"
              fill
              sizes="32px"
              priority
            />
          </div>
          <span className="font-semibold tracking-tight text-slate-900">
            The Modern Quill
          </span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className={navLinkClass(isHome)}>
            {t.nav.home}
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <button
              type="button"
              className={
                navLinkClass(isCategories) + " flex items-center gap-1 border-none"
              }
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <span>{t.nav.categories}</span>
              <svg
                className={`h-4 w-4 transition-transform ${
                  isCategoriesOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isCategoriesOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-xl bg-white shadow-lg ring-1 ring-slate-200">
                <div className="max-h-96 overflow-y-auto p-2">
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/about" className={navLinkClass(isAbout)}>
            {t.nav.about}
          </Link>
          <Link href="/contact" className={navLinkClass(isContact)}>
            {t.nav.contact}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <LanguageDropdown />
          <Link
            href="/login"
            className={`hidden rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-sm transition md:inline-flex ${
              isLogin
                ? "bg-orange-600 text-white hover:bg-orange-500"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {t.nav.login}
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 md:hidden"
          >
            <span className="h-4 w-4 rounded-sm bg-slate-700" />
          </button>
        </div>
      </nav>
    </div>
  );
}

