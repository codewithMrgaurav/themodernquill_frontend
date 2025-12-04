import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { categories, getCategoryBySlug } from "@/lib/categories";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com";

  return {
    title: `${category.name} Articles & Insights | The Modern Quill`,
    description: `Explore the latest articles, insights, and stories about ${category.name.toLowerCase()}. Discover expert content covering all aspects of ${category.name.toLowerCase()}. Read well-researched articles written by professionals.`,
    keywords: [
      category.name.toLowerCase(),
      `${category.name.toLowerCase()} articles`,
      `${category.name.toLowerCase()} blog`,
      `${category.name.toLowerCase()} insights`,
      "expert articles",
      "professional content",
    ],
    openGraph: {
      title: `${category.name} Articles & Insights | The Modern Quill`,
      description: `Explore the latest articles, insights, and stories about ${category.name.toLowerCase()}.`,
      type: "website",
      url: `${baseUrl}/category/${slug}`,
      siteName: "The Modern Quill",
    },
    twitter: {
      card: "summary",
      title: `${category.name} Articles & Insights`,
      description: `Explore the latest articles about ${category.name.toLowerCase()}.`,
    },
    alternates: {
      canonical: `${baseUrl}/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Placeholder posts - will be replaced with real data from backend
  // Using Pexels images for demo
  const pexelsImages = [
    "https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  ];

  const samplePosts = [
    {
      title: `Top 10 ${category.name} Trends to Watch in 2025`,
      slug: `top-10-${category.slug}-trends-2025`,
      excerpt: `Discover the most important trends and developments in ${category.name.toLowerCase()} that will shape the future.`,
      image: pexelsImages[0],
      readTime: "8 min read",
      date: "2025-01-15",
    },
    {
      title: `Complete Guide to ${category.name} for Beginners`,
      slug: `complete-guide-${category.slug}-beginners`,
      excerpt: `A comprehensive introduction to ${category.name.toLowerCase()} covering all the essentials you need to know.`,
      image: pexelsImages[1],
      readTime: "12 min read",
      date: "2025-01-10",
    },
    {
      title: `Expert Insights: ${category.name} Best Practices`,
      slug: `expert-insights-${category.slug}-best-practices`,
      excerpt: `Learn from industry experts about the best practices and strategies in ${category.name.toLowerCase()}.`,
      image: pexelsImages[2],
      readTime: "10 min read",
      date: "2025-01-05",
    },
  ];

  return (
    <section className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-600" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-orange-600 transition">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/categories" className="hover:text-orange-600 transition">
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
          Explore the latest articles, insights, and stories about{" "}
          {category.name.toLowerCase()}. Discover expert content covering all
          aspects of this topic.
        </p>
      </header>

      {/* Posts Grid */}
      <div>
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Latest Articles
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {samplePosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={post.image}
                    alt={`${post.title} - ${category.name} article image`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                      {category.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {post.readTime}
                    </span>
                    <span className="text-xs text-slate-500">{post.date}</span>
                  </div>
                  <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-orange-600 transition">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Related Categories */}
      <div className="rounded-2xl bg-slate-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Explore Related Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((cat) => cat.slug !== category.slug)
            .slice(0, 8)
            .map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-orange-50 hover:text-orange-600 hover:ring-orange-200"
              >
                {cat.name}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}

