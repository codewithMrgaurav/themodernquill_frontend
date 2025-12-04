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
        url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "The Modern Quill - Expert Blog Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Modern Quill - Expert Insights Across 30+ Categories",
    description:
      "Discover expert insights, well-researched articles, and valuable knowledge across 30+ categories.",
    images: [
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop",
    ],
  },
  alternates: {
    canonical: "/",
  },
};

