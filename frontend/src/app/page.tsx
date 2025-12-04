"use client";

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { categories } from "@/lib/categories";
import { slugify } from "@/lib/utils";
import { CategoryIcon, getCategoryColor } from "@/components/icons/CategoryIcon";
import { useContent } from "@/contexts/ContentContext";
import { useLanguage } from "@/contexts/LanguageContext";

// Note: Metadata export doesn't work with "use client" components
// For SEO, we'll add metadata via layout or use a server component wrapper

export default function Home() {
  const { content } = useContent();
  const { t } = useLanguage();
  // Add article counts for display (will come from backend later)
  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count: Math.floor(Math.random() * 300) + 100, // Placeholder counts
  }));

  const featuredPosts = [
    {
      title: "Top 10 AI Tools for Content Creation in 2025",
      category: "AI",
      slug: slugify("Top 10 AI Tools for Content Creation in 2025"),
      excerpt: "Discover the most powerful AI tools that are revolutionizing content creation and helping creators produce high-quality content faster.",
      description: "Explore the best AI-powered tools for content creators in 2025. From writing assistants to design generators, discover how artificial intelligence is transforming the creative industry and helping professionals work smarter.",
      hashtags: ["#AITools", "#ContentCreation", "#DigitalMarketing", "#Productivity", "#Tech2025"],
      keywords: ["AI tools", "content creation", "artificial intelligence", "marketing automation", "creative tools", "productivity software"],
      image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      readTime: "8 min read",
    },
    {
      title: "Complete Guide to Content Marketing for Bloggers",
      category: "Marketing",
      slug: slugify("Complete Guide to Content Marketing for Bloggers"),
      excerpt: "Learn how to create engaging content that resonates with your audience and builds a loyal readership for your blog.",
      description: "Master content marketing strategies that drive traffic and engagement. Learn proven techniques for creating valuable content, building audience trust, and growing your blog's reach through effective content distribution.",
      hashtags: ["#ContentMarketing", "#BloggingTips", "#DigitalStrategy", "#SEO", "#AudienceGrowth"],
      keywords: ["content marketing", "blogging strategy", "audience engagement", "content strategy", "blog growth", "content distribution"],
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      readTime: "12 min read",
    },
    {
      title: "How to Build a Successful Tech Startup in 2025",
      category: "Startups",
      slug: slugify("How to Build a Successful Tech Startup in 2025"),
      excerpt: "Essential strategies and insights for launching and scaling a tech startup, from idea validation to securing funding.",
      description: "Comprehensive guide to launching and scaling a technology startup. Learn about idea validation, team building, funding strategies, and growth tactics from successful entrepreneurs and industry experts.",
      hashtags: ["#StartupLife", "#TechEntrepreneurship", "#BusinessGrowth", "#Innovation", "#VentureCapital"],
      keywords: ["tech startup", "entrepreneurship", "startup funding", "business strategy", "innovation", "venture capital"],
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      readTime: "15 min read",
    },
  ];

  return (
    <section className="space-y-12">
      {/* Featured Posts Section - now at top */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-[10px] text-orange-600">
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
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            {content.home.featured.viewAll} →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg overflow-hidden"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500">{post.readTime}</span>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {post.hashtags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-orange-600 hover:text-orange-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.hashtags.length > 3 && (
                    <span className="text-xs text-slate-400">
                      +{post.hashtags.length - 3} {content.home.featured.moreHashtags}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-300 px-6 py-12 text-white shadow-lg sm:px-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-100">
          {content.home.hero.badge}
        </p>
        <h1 className="mt-3 max-w-3xl font-[family:var(--font-heading)] text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
          {content.home.hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-orange-50/95">
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
            {[
              {
                slug: "comprehensive-guide-modern-web-development-practices",
                title: "Comprehensive Guide to Modern Web Development Practices",
                description: "Learn the latest web development techniques and best practices that developers are using in 2025 to build fast, scalable applications.",
                hashtags: ["#WebDevelopment", "#JavaScript", "#BestPractices", "#Tech2025"],
                readTime: "10 min read",
                image: "https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
              },
              {
                slug: "top-10-javascript-frameworks-2025",
                title: "Top 10 JavaScript Frameworks to Learn in 2025",
                description: "Discover the most popular and powerful JavaScript frameworks that are shaping modern web development and in-demand skills.",
                hashtags: ["#JavaScript", "#Frameworks", "#React", "#Vue", "#Angular"],
                readTime: "12 min read",
                image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
              },
              {
                slug: "complete-guide-react-performance-optimization",
                title: "Complete Guide to React Performance Optimization",
                description: "Master techniques to optimize React applications for better performance, faster load times, and improved user experience.",
                hashtags: ["#React", "#Performance", "#Optimization", "#WebDev"],
                readTime: "15 min read",
                image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
              },
              {
                slug: "building-scalable-backend-architecture",
                title: "Building Scalable Backend Architecture: Best Practices",
                description: "Essential strategies for designing and implementing scalable backend systems that can handle growth and high traffic.",
                hashtags: ["#Backend", "#Architecture", "#Scalability", "#DevOps"],
                readTime: "18 min read",
                image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
              },
            ].map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
                    src={post.image}
                    alt={`${post.title} thumbnail image`}
                    fill
                    sizes="96px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.hashtags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-orange-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Newsletter */}
          <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-6 ring-1 ring-orange-100">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              {content.home.newsletter.title}
            </h3>
            <p className="mb-4 text-sm text-slate-600">
              {content.home.newsletter.description}
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder={content.home.newsletter.placeholder}
                className="w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-orange-100 transition focus:border-orange-300 focus:ring-2"
              />
              <button
                type="button"
                className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                {content.home.newsletter.button}
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* Category Showcase */}
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="mb-6 text-xl font-semibold text-slate-900">
          {content.home.exploreCategories.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categoriesWithCounts.map((cat) => (
            <Link
              key={cat.slug}
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
              <h3 className="mb-1 text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500">{cat.count} {content.categories.articlesLabel}</p>
            </Link>
          ))}
    </div>
      </section>
    </section>
  );
}
