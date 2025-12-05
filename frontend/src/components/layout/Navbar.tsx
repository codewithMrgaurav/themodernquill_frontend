"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/categories";
import { LanguageDropdown } from "./LanguageDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMode } from "@/contexts/ModeContext";

function navLinkClass(isActive: boolean) {
  const base =
    "relative px-2 py-2 text-base font-medium border-b-2 border-transparent transition-colors";
  if (isActive) {
    return `${base} border-blue-600 text-slate-900`;
  }
  return `${base} text-slate-600 hover:text-slate-900`;
}

export function Navbar() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, setMode, isAdminMode } = useMode();

  const isHome = pathname === "/" || pathname === "";
  const isCategories =
    pathname.startsWith("/category") || pathname.startsWith("/categories");
  const isAbout = pathname.startsWith("/about");
  const isContact = pathname.startsWith("/contact");
  const isLogin = pathname.startsWith("/login");

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleModeSwitch = (newMode: "user" | "admin") => {
    setMode(newMode);
    if (newMode === "admin") {
      router.push("/admin");
    } else {
      // If on admin page, redirect to home
      if (pathname.startsWith("/admin")) {
        router.push("/");
      }
    }
  };

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-2xl shadow-sm ring-1 ring-blue-300/70">
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
                        className="rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
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
          {isAuthenticated && user?.role === "admin" && (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-xs font-medium text-slate-500">Mode:</span>
              <div className="inline-flex items-center rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => handleModeSwitch("user")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    mode === "user"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  User
                </button>
                <button
                  onClick={() => handleModeSwitch("admin")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    mode === "admin"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}
          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm text-slate-600 max-w-[150px] truncate">
                {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide bg-red-600 text-white hover:bg-red-700 shadow-sm transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`hidden rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-sm transition md:inline-flex ${
                isLogin
                  ? "bg-blue-700 text-white hover:bg-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {t.nav.login}
            </Link>
          )}
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

