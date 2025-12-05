import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - The Modern Quill",
  description:
    "Learn about The Modern Quill - a platform run by engineers, doctors, and professionals passionate about sharing expert insights and well-researched articles across 30+ categories.",
  keywords: [
    "about The Modern Quill",
    "blog team",
    "expert writers",
    "engineers",
    "doctors",
    "professional content creators",
    "blog platform",
    "editorial team",
  ],
  openGraph: {
    title: "About Us - The Modern Quill",
    description:
      "Learn about The Modern Quill - a platform run by engineers, doctors, and professionals passionate about sharing expert insights.",
    type: "website",
    url: "/about",
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
    title: "About Us - The Modern Quill",
    description: "Learn about The Modern Quill and our team of expert writers.",
    images: ["/blog-logo.svg"],
  },
  alternates: {
    canonical: "/about",
  },
};

