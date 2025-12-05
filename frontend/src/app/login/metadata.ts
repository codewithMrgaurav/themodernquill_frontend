import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | The Modern Quill",
  description:
    "Sign in to The Modern Quill to save your favorite articles and personalize your reading experience.",
  keywords: [
    "login",
    "sign in",
    "user account",
    "The Modern Quill login",
  ],
  openGraph: {
    title: "Login | The Modern Quill",
    description:
      "Access your The Modern Quill account and personalize your reading experience.",
    type: "website",
    url: "/login",
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
    title: "Login | The Modern Quill",
    description: "Sign in to your account on The Modern Quill.",
    images: ["/blog-logo.svg"],
  },
  alternates: {
    canonical: "/login",
  },
};


