"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/contexts/ApiContext";
import { Post } from "@/lib/api";

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const router = useRouter();
  const { fetchPostBySlug, loading, error } = useApi();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPost = async () => {
      const postData = await fetchPostBySlug(slug);
      if (postData) {
        setPost(postData);
        
        // Fetch related posts from same category
        if (postData.category?._id) {
          // This will be implemented when we add related posts endpoint
          // For now, we'll use subposts if available
          if (postData.subposts && postData.subposts.length > 0) {
            setRelatedPosts(postData.subposts.slice(0, 3));
          }
        }
      } else {
        notFound();
      }
    };

    loadPost();
  }, [slug, fetchPostBySlug]);

  if (loading && !post) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Post not found"}</p>
        <Link href="/" className="mt-4 inline-block text-blue-700 hover:text-blue-800">
          Go back home
        </Link>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com";

  // Breadcrumb Schema for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.category?.name || "Category",
        item: `${baseUrl}/category/${post.category?.slug || ""}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };

  // Article Schema for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || post.excerpt,
    image: {
      "@type": "ImageObject",
      url: post.image,
      width: 1200,
      height: 630,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Organization",
      name: "The Modern Quill",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "The Modern Quill",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/blog-logo.svg`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    keywords: post.keywords?.join(", ") || "",
    articleSection: post.category?.name || "",
  };

  return (
    <>
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <article className="space-y-8">
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
              <Link
                href={`/category/${post.category?.slug || ""}`}
                className="hover:text-blue-700 transition"
              >
                {post.category?.name || "Uncategorized"}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-900 font-medium line-clamp-1">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            {post.category && (
              <Link
                href={`/category/${post.category.slug}`}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-200 transition"
              >
                {post.category.name}
              </Link>
            )}
            <span className="text-sm text-slate-500">{post.readTime || "5 min read"}</span>
            <span className="text-sm text-slate-500">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            {post.title}
          </h1>
          <p className="text-xl text-slate-600">
            {post.description || post.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="relative h-96 w-full overflow-hidden rounded-2xl">
          <Image
            src={post.image || "/blog-logo.svg"}
            alt={`${post.title} - Featured image`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-slate max-w-none">
          {post.contentBlocks && post.contentBlocks.length > 0 ? (
            <div className="space-y-6 text-base leading-relaxed text-slate-700">
              {post.contentBlocks
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((block, idx) => (
                  <div key={block.id || idx}>
                    {block.type === "paragraph" && (
                      <p dangerouslySetInnerHTML={{ __html: block.data?.text || "" }} />
                    )}
                    {block.type === "heading" && (
                      <h2 className="text-2xl font-bold">{block.data?.text || ""}</h2>
                    )}
                    {block.type === "image" && block.data?.url && (
                      <div className="my-6">
                        <Image
                          src={block.data.url}
                          alt={block.data.alt || ""}
                          width={block.data.width || 800}
                          height={block.data.height || 600}
                          className="rounded-lg"
                        />
                      </div>
                    )}
                    {/* Add more block types as needed */}
                  </div>
                ))}
            </div>
          ) : post.content ? (
            <div
              className="space-y-6 text-base leading-relaxed text-slate-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
              itemProp="articleBody"
            />
          ) : (
            <p className="text-slate-600">Content not available</p>
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost._id || relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
                    <Image
                      src={relatedPost.image || "/blog-logo.svg"}
                      alt={relatedPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-blue-700 transition">
                      {relatedPost.title}
                    </h3>
                    <p className="mb-2 text-sm text-slate-600 line-clamp-2">
                      {relatedPost.excerpt || relatedPost.description}
                    </p>
                    <span className="text-xs text-slate-500">
                      {relatedPost.readTime || "5 min read"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

