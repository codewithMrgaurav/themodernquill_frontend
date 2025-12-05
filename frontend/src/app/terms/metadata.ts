import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | The Modern Quill",
  description:
    "Review The Modern Quill terms of use, including acceptable use, content ownership, and limitations of liability.",
  keywords: [
    "terms of use",
    "terms and conditions",
    "acceptable use",
    "content ownership",
    "The Modern Quill terms",
  ],
  openGraph: {
    title: "Terms of Use | The Modern Quill",
    description:
      "Learn about The Modern Quill terms of use, acceptable use, and content ownership.",
    type: "website",
    url: "/terms",
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
    title: "Terms of Use | The Modern Quill",
    description: "Read The Modern Quill terms of use and legal information.",
    images: ["/blog-logo.svg"],
  },
  alternates: {
    canonical: "/terms",
  },
};


