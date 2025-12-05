import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api, endpoints, Category as ApiCategory } from "@/lib/api";
import { getCategoryBySlug, Category as StaticCategory } from "@/lib/categories";
import CategoryPageClient from "./CategoryPageClient";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const response = await api.get(endpoints.categories);
    if (!response.success || !response.data) {
      // Fallback to static categories if API fails
      const { categories } = await import("@/lib/categories");
      return categories.map((category) => ({
        slug: category.slug,
      }));
    }
    return (response.data as ApiCategory[]).map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    // Fallback to static categories on error
    const { categories } = await import("@/lib/categories");
    return categories.map((category) => ({
      slug: category.slug,
    }));
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Try to fetch category from API
  let categoryName: string | null = null;
  let categoryDescription: string | undefined = undefined;
  
  try {
    const response = await api.get(endpoints.categoryBySlug(slug), undefined, false);
    if (response.success && response.data) {
      const apiCategory = response.data as ApiCategory;
      categoryName = apiCategory.name;
      categoryDescription = apiCategory.description;
    }
  } catch (error) {
    // Fallback to static categories
    const staticCategory = getCategoryBySlug(slug);
    if (staticCategory) {
      categoryName = staticCategory.name;
      categoryDescription = staticCategory.description;
    }
  }

  // If still no category, use fallback
  if (!categoryName) {
    const staticCategory = getCategoryBySlug(slug);
    if (staticCategory) {
      categoryName = staticCategory.name;
      categoryDescription = staticCategory.description;
    }
  }

  if (!categoryName) {
    return {
      title: "Category Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com";

  return {
    title: `${categoryName} Articles & Insights | The Modern Quill`,
    description: categoryDescription || `Explore the latest articles, insights, and stories about ${categoryName.toLowerCase()}. Discover expert content covering all aspects of ${categoryName.toLowerCase()}. Read well-researched articles written by professionals.`,
    keywords: [
      categoryName.toLowerCase(),
      `${categoryName.toLowerCase()} articles`,
      `${categoryName.toLowerCase()} blog`,
      `${categoryName.toLowerCase()} insights`,
      "expert articles",
      "professional content",
    ],
    openGraph: {
      title: `${categoryName} Articles & Insights | The Modern Quill`,
      description: categoryDescription || `Explore the latest articles, insights, and stories about ${categoryName.toLowerCase()}.`,
      type: "website",
      url: `${baseUrl}/category/${slug}`,
      siteName: "The Modern Quill",
    },
    twitter: {
      card: "summary",
      title: `${categoryName} Articles & Insights`,
      description: categoryDescription || `Explore the latest articles about ${categoryName.toLowerCase()}.`,
    },
    alternates: {
      canonical: `${baseUrl}/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  return <CategoryPageClient slug={slug} />;
}

