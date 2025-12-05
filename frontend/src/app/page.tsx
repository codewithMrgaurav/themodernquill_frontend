"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CategoryIcon, getCategoryColor } from "@/components/icons/CategoryIcon";
import { useContent } from "@/contexts/ContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/contexts/ApiContext";
import { Post, Category } from "@/lib/api";
import { NewsletterForm } from "@/components/NewsletterForm";

export default function Home() {
  const { content } = useContent();
  const { t } = useLanguage();
  const { 
    loading, 
    posts, 
    categories, 
    fetchPosts, 
    fetchCategories 
  } = useApi();
  
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<Array<Category & { count: number }>>([]);

  useEffect(() => {
    // Fetch posts and categories on mount
    fetchPosts({ status: "published", limit: 20, isFeatured: true });
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  useEffect(() => {
    // Update featured posts
    if (posts.length > 0) {
      const featured = posts.filter((post: Post) => post.isFeatured).slice(0, 3);
      setFeaturedPosts(featured.length > 0 ? featured : posts.slice(0, 3));
    }
  }, [posts]);

  useEffect(() => {
    // Update latest posts (non-featured)
    if (posts.length > 0) {
      const latest = posts.filter((post: Post) => !post.isFeatured).slice(0, 4);
      setLatestPosts(latest);
    }
  }, [posts]);

  useEffect(() => {
    // Update categories with post counts
    if (categories.length > 0) {
      const categoriesWithPostCounts = categories.map((cat: Category) => {
        const categoryPosts = posts.filter((post: Post) => 
          post.category?._id === cat._id || post.category?.slug === cat.slug
        );
        return {
          ...cat,
          count: categoryPosts.length || Math.floor(Math.random() * 4) + 2,
        };
      });
      setCategoriesWithCounts(categoriesWithPostCounts);
    }
  }, [categories, posts]);

  // Show loading state
  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-12">
      {/* Featured Posts Section - now at top */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] text-blue-700">
            ✦
          </span>
          <span>{content.home.featured.label}</span>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {content.home.featured.title}
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            {content.home.featured.viewAll} →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post) => (
              <Link
                key={post._id || post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg overflow-hidden"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={post.image || "/blog-logo.svg"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {post.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-xs text-slate-500">{post.readTime || "5 min read"}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {post.excerpt || post.description}
                  </p>
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {post.hashtags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium text-blue-700 hover:text-blue-800"
                        >
                          {tag.startsWith("#") ? tag : `#${tag}`}
                        </span>
                      ))}
                      {post.hashtags.length > 3 && (
                        <span className="text-xs text-slate-400">
                          +{post.hashtags.length - 3} {content.home.featured.moreHashtags}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
              No featured posts available
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-400 px-6 py-12 text-white shadow-lg sm:px-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-100">
          {content.home.hero.badge}
        </p>
        <h1 className="mt-3 max-w-3xl font-[family:var(--font-heading)] text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
          {content.home.hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-50/95">
          {content.home.hero.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          {content.home.hero.badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 font-medium">
                {badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Latest Posts */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900" id="latest-posts">
            {content.home.latest.title}
          </h2>
          <div className="space-y-4">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <Link
                  key={post._id || post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={post.image || "/blog-logo.svg"}
                      alt={`${post.title} thumbnail image`}
                      fill
                      sizes="96px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{post.readTime || "5 min read"}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {post.excerpt || post.description}
                    </p>
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.hashtags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium text-blue-700"
                          >
                            {tag.startsWith("#") ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                No posts available
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Newsletter - Stay Updated */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-7 ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10">
            <div className="mb-4 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-blue-300">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[10px] text-blue-100">
                ✉
              </span>
              <span>Newsletter</span>
            </div>
            <h3 className="mb-1 text-lg font-semibold text-white">
              {content.home.newsletter.title}
            </h3>
            <p className="mb-5 text-sm text-slate-300">
              {content.home.newsletter.description}
            </p>
            <NewsletterForm />
          </div>
        </aside>
      </div>

      {/* Category Showcase */}
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="mb-6 text-xl font-semibold text-slate-900">
          {content.home.exploreCategories.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categoriesWithCounts.length > 0 ? (
            categoriesWithCounts.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                href={`/category/${cat.slug}`}
                className="group rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-slate-200"
              >
                <div
                  className={
                    "mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-xl border text-base " +
                    getCategoryColor(cat.slug)
                  }
                >
                  <CategoryIcon category={{ slug: cat.slug, name: cat.name }} />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500">{cat.count} {content.categories.articlesLabel}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-slate-500">
              No categories available
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
