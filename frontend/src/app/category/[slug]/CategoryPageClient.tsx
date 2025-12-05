"use client";

import { useEffect, useState, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/contexts/ApiContext";
import { Post, Category } from "@/lib/api";
import { categories } from "@/lib/categories";

interface CategoryPageClientProps {
  slug: string;
}

export default function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const { fetchCategoryBySlug, fetchPosts, loading, error, posts: allPosts } = useApi();
  const [category, setCategory] = useState<Category | null>(null);
  
  // Filter posts for this category
  const posts = useMemo(() => {
    if (!category || !allPosts) return [];
    return allPosts.filter((post: Post) => 
      post.category?._id === category._id || post.category?.slug === category.slug
    );
  }, [category, allPosts]);

  useEffect(() => {
    const loadData = async () => {
      const categoryData = await fetchCategoryBySlug(slug);
      if (categoryData) {
        setCategory(categoryData);
      } else {
        // Fallback to static categories
        const staticCategory = categories.find(cat => cat.slug === slug);
        if (staticCategory) {
          setCategory({
            _id: slug,
            name: staticCategory.name,
            slug: staticCategory.slug,
            description: staticCategory.description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          notFound();
        }
      }
    };

    loadData();
  }, [slug, fetchCategoryBySlug]);

  // Fetch posts when category is loaded
  useEffect(() => {
    if (category?._id) {
      fetchPosts({ 
        category: category._id,
        status: "published",
        limit: 20 
      });
    }
  }, [category, fetchPosts]);

  if (loading && !category) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Category not found</p>
        <Link href="/categories" className="mt-4 inline-block text-blue-700 hover:text-blue-800">
          Browse all categories
        </Link>
      </div>
    );
  }

  // Get related categories (exclude current)
  const relatedCategories = categories
    .filter((cat) => cat.slug !== category.slug)
    .slice(0, 8);

  return (
    <section className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-600" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-blue-700 transition">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/categories" className="hover:text-blue-700 transition">
              Categories
            </Link>
          </li>
          <li>/</li>
          <li className="text-slate-900 font-medium">{category.name}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          {category.name}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          {category.description || `Explore the latest articles, insights, and stories about ${category.name.toLowerCase()}. Discover expert content covering all aspects of this topic.`}
        </p>
      </header>

      {/* Posts Grid */}
      <div>
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Latest Articles
        </h2>
        {loading && posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-slate-600">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id || post.slug}
                className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                    <Image
                      src={post.image || "/blog-logo.svg"}
                      alt={`${post.title} - ${category.name} article image`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {category.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {post.readTime || "5 min read"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-blue-700 transition">
                      {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {post.excerpt || post.description}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No posts available in this category
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div className="rounded-2xl bg-slate-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Explore Related Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {relatedCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-200"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

