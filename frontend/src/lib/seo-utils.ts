/**
 * SEO Utility Functions
 * Helper functions for generating SEO-friendly content
 */

export function generateMetaTitle(title: string, siteName: string = "The Modern Quill"): string {
  return `${title} | ${siteName}`;
}

export function generateMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength - 3).trim() + "...";
}

export function generateKeywords(baseKeywords: string[], additional: string[] = []): string {
  return [...baseKeywords, ...additional].join(", ");
}

export function generateCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com";
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function generateOpenGraphImage(
  imageUrl: string,
  width: number = 1200,
  height: number = 630
) {
  return {
    url: imageUrl,
    width,
    height,
    alt: "The Modern Quill",
  };
}

/**
 * Generate Article Schema for a blog post
 */
export function generateArticleSchema(post: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  author: { name: string; slug: string };
  category: { name: string; slug: string };
  keywords: string[];
  content: string;
  slug: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: {
      "@type": "ImageObject",
      url: post.image,
      width: 1200,
      height: 630,
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${baseUrl}/author/${post.author.slug}`,
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
    keywords: post.keywords.join(", "),
    articleSection: post.category.name,
    wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
    inLanguage: "en-US",
  };
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(items: Array<{ label: string; href: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http") ? item.href : `${baseUrl}${item.href}`,
    })),
  };
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

