import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | The Modern Quill",
  description:
    "Read The Modern Quill's privacy policy to understand how we handle analytics, cookies, and data in line with applicable regulations.",
  keywords: [
    "privacy policy",
    "data protection",
    "cookies",
    "analytics",
    "The Modern Quill privacy",
  ],
  openGraph: {
    title: "Privacy Policy | The Modern Quill",
    description:
      "Learn how The Modern Quill handles analytics, cookies, and data in line with privacy regulations.",
    type: "website",
    url: "/privacy",
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
    card: "summary",
    title: "Privacy Policy | The Modern Quill",
    description: "Read The Modern Quill's privacy policy and data practices.",
    images: ["/blog-logo.svg"],
  },
  alternates: {
    canonical: "/privacy",
  },
};


