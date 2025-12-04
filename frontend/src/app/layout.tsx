import type { Metadata } from "next";
import { Merriweather, Roboto } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ContentProvider } from "../contexts/ContentContext";

const headingFont = Merriweather({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const bodyFont = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com"),
  title: {
    default: "The Modern Quill - Expert Insights Across 30+ Categories",
    template: "%s | The Modern Quill",
  },
  description:
    "The Modern Quill - Your trusted source for well-researched articles, expert insights, and valuable knowledge across technology, health, business, and more. Curated by engineers, doctors, and professionals.",
  keywords: [
    "blog",
    "articles",
    "expert insights",
    "technology blog",
    "health blog",
    "business blog",
    "professional articles",
    "well-researched content",
    "knowledge hub",
    "blogging platform",
  ],
  authors: [{ name: "The Modern Quill Editorial Team" }],
  creator: "The Modern Quill",
  publisher: "The Modern Quill",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "The Modern Quill",
    title: "The Modern Quill - Expert Insights Across 30+ Categories",
    description:
      "Your trusted source for well-researched articles, expert insights, and valuable knowledge across technology, health, business, and more.",
    images: [
      {
        url: "/blog-logo.svg",
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
      "Your trusted source for well-researched articles, expert insights, and valuable knowledge.",
    creator: "@themodernquill",
    images: ["/blog-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization Schema for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Modern Quill",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com"}/blog-logo.svg`,
    description:
      "The Modern Quill - Your trusted source for well-researched articles, expert insights, and valuable knowledge across technology, health, business, and more.",
    sameAs: [
      // Add social media links when available
      // "https://twitter.com/themodernquill",
      // "https://facebook.com/themodernquill",
      // "https://linkedin.com/company/themodernquill",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "editor@themodernquill.com",
    },
  };

  // Website Schema for SEO
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Modern Quill",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com",
    description:
      "Expert insights, well-researched articles, and valuable knowledge across 30+ categories",
    publisher: {
      "@type": "Organization",
      name: "The Modern Quill",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com"}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <ContentProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <header>
                <Navbar />
              </header>
              <main className="flex-1">
                <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <footer>
                <Footer />
              </footer>
            </div>
          </LanguageProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
