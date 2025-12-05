import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - The Modern Quill",
  description:
    "Get in touch with The Modern Quill editorial team. Have questions, suggestions, or want to collaborate? We'd love to hear from you.",
  keywords: [
    "contact The Modern Quill",
    "blog contact",
    "editorial team",
    "get in touch",
    "blog feedback",
    "collaboration",
  ],
  openGraph: {
    title: "Contact Us - The Modern Quill",
    description: "Get in touch with The Modern Quill editorial team.",
    type: "website",
    url: "/contact",
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
    title: "Contact Us - The Modern Quill",
    description: "Get in touch with our editorial team.",
    images: ["/blog-logo.svg"],
  },
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
};

