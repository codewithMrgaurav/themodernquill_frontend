import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Modern Quill - Expert Insights Across 30+ Categories",
  description:
    "Discover expert insights, well-researched articles, and valuable knowledge across 30+ categories including technology, AI, business, health, travel, and more. Curated by engineers, doctors, and professionals.",
  keywords: [
    "blog",
    "articles",
    "expert insights",
    "technology blog",
    "health blog",
    "business blog",
    "AI articles",
    "professional content",
    "well-researched articles",
    "knowledge hub",
    "blogging platform",
    "tech insights",
    "health insights",
    "business insights",
  ],
  openGraph: {
    title: "The Modern Quill - Expert Insights Across 30+ Categories",
    description:
      "Discover expert insights, well-researched articles, and valuable knowledge across 30+ categories. Curated by engineers, doctors, and professionals.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/blog-logo.svg",
        width: 1200,
        height: 630,
        alt: "The Modern Quill logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Modern Quill - Expert Insights Across 30+ Categories",
    description:
      "Discover expert insights, well-researched articles, and valuable knowledge across 30+ categories.",
    images: ["/blog-logo.svg"],
  },
  alternates: {
    canonical: "/",
  },
};

