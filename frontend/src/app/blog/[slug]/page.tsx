import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/categories";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// This will be replaced with real data from backend
const getPostBySlug = async (slug: string) => {
  // Placeholder content based on slug - will fetch from API later
  const postData: Record<
    string,
    {
      title: string;
      excerpt: string;
      description: string;
      content: string;
      categoryIndex: number;
      author: { name: string; slug: string; bio: string };
      publishedAt: string;
      readTime: string;
      hashtags: string[];
      keywords: string[];
    }
  > = {
    "top-10-ai-tools-for-content-creation-in-2025": {
      title: "Top 10 AI Tools for Content Creation in 2025",
      excerpt:
        "Discover the most powerful AI tools that are revolutionizing content creation and helping creators produce high-quality content faster.",
      description:
        "Explore the best AI-powered tools for content creators in 2025. From writing assistants to design generators, discover how artificial intelligence is transforming the creative industry and helping professionals work smarter.",
      hashtags: ["#AITools", "#ContentCreation", "#DigitalMarketing", "#Productivity", "#Tech2025"],
      keywords: ["AI tools", "content creation", "artificial intelligence", "marketing automation", "creative tools", "productivity software"],
      content: `
        <h2>Introduction to AI Content Creation</h2>
        <p>Artificial Intelligence has transformed the way we create content. From writing to design, AI tools are making it easier than ever to produce professional-quality work in a fraction of the time.</p>
        
        <h2>1. ChatGPT by OpenAI</h2>
        <p>ChatGPT remains one of the most versatile AI writing assistants. It can help with brainstorming, drafting, editing, and even generating entire articles. Its natural language understanding makes it an invaluable tool for content creators.</p>
        
        <h2>2. Midjourney for Visual Content</h2>
        <p>Midjourney excels at creating stunning visual content from text prompts. Whether you need illustrations, graphics, or concept art, this tool delivers professional results that can elevate your content.</p>
        
        <h2>3. Grammarly for Editing</h2>
        <p>Grammarly goes beyond simple spell-checking. It provides style suggestions, tone adjustments, and clarity improvements that help your writing shine.</p>
        
        <h2>4. Canva AI Features</h2>
        <p>Canva's AI-powered design tools make graphic creation accessible to everyone. From templates to image generation, it streamlines the design process.</p>
        
        <h2>5. Jasper for Marketing Content</h2>
        <p>Jasper specializes in marketing copy that converts. It understands brand voice and can generate everything from social media posts to email campaigns.</p>
        
        <h2>Conclusion</h2>
        <p>These AI tools represent the cutting edge of content creation technology. By leveraging them effectively, creators can significantly enhance their productivity and output quality.</p>
      `,
      categoryIndex: 1, // AI
      author: {
        name: "Sarah Johnson",
        slug: "sarah-johnson",
        bio: "AI technology expert and content strategist",
      },
      publishedAt: "2025-01-20",
      readTime: "8 min read",
    },
    "complete-guide-to-content-marketing-for-bloggers": {
      title: "Complete Guide to Content Marketing for Bloggers",
      excerpt:
        "Learn how to create engaging content that resonates with your audience and builds a loyal readership for your blog.",
      description:
        "Master content marketing strategies that drive traffic and engagement. Learn proven techniques for creating valuable content, building audience trust, and growing your blog's reach through effective content distribution.",
      hashtags: ["#ContentMarketing", "#BloggingTips", "#DigitalStrategy", "#SEO", "#AudienceGrowth"],
      keywords: ["content marketing", "blogging strategy", "audience engagement", "content strategy", "blog growth", "content distribution"],
      content: `
        <h2>Understanding Content Marketing</h2>
        <p>Content marketing is the strategic approach of creating and distributing valuable, relevant content to attract and engage a clearly defined audience. For bloggers, this means understanding your readers' needs and delivering content that addresses them.</p>
        
        <h2>Know Your Audience</h2>
        <p>The foundation of successful content marketing is knowing who you're writing for. Create detailed reader personas that include demographics, interests, pain points, and goals. This helps you tailor your content to what your audience actually wants to read.</p>
        
        <h2>Content Planning and Strategy</h2>
        <p>Develop a content calendar that balances different types of posts: how-to guides, listicles, case studies, and personal stories. Consistency is key—regular publishing builds trust and keeps readers coming back.</p>
        
        <h2>SEO Best Practices</h2>
        <p>While creating great content, don't forget SEO. Research keywords your audience uses, optimize your headlines, and structure your posts with proper headings. Internal linking helps both readers and search engines understand your content better.</p>
        
        <h2>Promotion and Distribution</h2>
        <p>Great content needs promotion. Share on social media, engage in relevant communities, and consider email newsletters. Building relationships with other bloggers can lead to guest posting opportunities and backlinks.</p>
        
        <h2>Measuring Success</h2>
        <p>Track metrics like page views, time on page, bounce rate, and social shares. Use this data to understand what resonates with your audience and refine your content strategy accordingly.</p>
      `,
      categoryIndex: 3, // Marketing
      author: {
        name: "Michael Chen",
        slug: "michael-chen",
        bio: "Content marketing strategist with 10+ years of experience",
      },
      publishedAt: "2025-01-18",
      readTime: "12 min read",
    },
    "how-to-build-successful-tech-startup-in-2025": {
      title: "How to Build a Successful Tech Startup in 2025",
      excerpt:
        "Essential strategies and insights for launching and scaling a tech startup, from idea validation to securing funding.",
      description:
        "Comprehensive guide to launching and scaling a technology startup. Learn about idea validation, team building, funding strategies, and growth tactics from successful entrepreneurs and industry experts.",
      hashtags: ["#StartupLife", "#TechEntrepreneurship", "#BusinessGrowth", "#Innovation", "#VentureCapital"],
      keywords: ["tech startup", "entrepreneurship", "startup funding", "business strategy", "innovation", "venture capital"],
      content: `
        <h2>Validating Your Startup Idea</h2>
        <p>Before investing time and resources, validate that your idea solves a real problem. Talk to potential customers, conduct market research, and build a minimum viable product (MVP) to test your assumptions.</p>
        
        <h2>Building the Right Team</h2>
        <p>Your team is your greatest asset. Look for co-founders and early employees who complement your skills and share your vision. Diversity in thought and experience leads to better decision-making.</p>
        
        <h2>Product Development Strategy</h2>
        <p>Focus on building something people actually want. Use agile development methodologies, gather continuous feedback, and iterate quickly. Don't fall in love with your first idea—be willing to pivot based on user needs.</p>
        
        <h2>Funding and Financial Management</h2>
        <p>Understand your funding options: bootstrapping, angel investors, venture capital, or grants. Each has pros and cons. Manage your runway carefully and always know your burn rate.</p>
        
        <h2>Marketing and Growth</h2>
        <p>Develop a clear go-to-market strategy. Whether it's content marketing, paid advertising, or partnerships, focus on channels that reach your target customers effectively. Measure everything and double down on what works.</p>
        
        <h2>Scaling Your Startup</h2>
        <p>Scaling requires strong systems, processes, and culture. Invest in automation, hire strategically, and maintain your company culture as you grow. Remember that sustainable growth is better than rapid, unsustainable expansion.</p>
      `,
      categoryIndex: 9, // Startups
      author: {
        name: "David Martinez",
        slug: "david-martinez",
        bio: "Serial entrepreneur and startup advisor",
      },
      publishedAt: "2025-01-15",
      readTime: "15 min read",
    },
    "comprehensive-guide-modern-web-development-practices": {
      title: "Comprehensive Guide to Modern Web Development Practices",
      excerpt:
        "Learn the latest web development techniques and best practices that developers are using in 2025 to build fast, scalable, and user-friendly applications.",
      description:
        "Complete guide to modern web development practices including frameworks, performance optimization, responsive design, security, testing, and DevOps strategies for building production-ready applications.",
      hashtags: ["#WebDevelopment", "#JavaScript", "#BestPractices", "#Tech2025", "#FullStack"],
      keywords: ["web development", "JavaScript frameworks", "best practices", "performance optimization", "responsive design", "security"],
      content: `
        <h2>Modern Development Frameworks</h2>
        <p>Frameworks like React, Next.js, and Vue.js have revolutionized web development. They provide component-based architectures that make code more maintainable and scalable. Choose frameworks based on your project needs and team expertise.</p>
        
        <h2>Performance Optimization</h2>
        <p>Modern web applications must be fast. Implement code splitting, lazy loading, and optimize images. Use tools like Lighthouse to measure and improve Core Web Vitals. Every millisecond counts in user experience.</p>
        
        <h2>Responsive Design Principles</h2>
        <p>With mobile traffic exceeding desktop, responsive design is non-negotiable. Use CSS Grid and Flexbox for flexible layouts. Test on multiple devices and screen sizes to ensure your design works everywhere.</p>
        
        <h2>Security Best Practices</h2>
        <p>Protect user data with HTTPS, implement proper authentication, and sanitize all inputs. Stay updated on security vulnerabilities and follow OWASP guidelines. Security should be built in, not bolted on.</p>
        
        <h2>Testing and Quality Assurance</h2>
        <p>Write tests for critical functionality. Use unit tests, integration tests, and end-to-end testing. Automated testing catches bugs early and gives confidence when refactoring code.</p>
        
        <h2>DevOps and Deployment</h2>
        <p>Implement CI/CD pipelines for automated testing and deployment. Use version control effectively with Git. Monitor your applications in production and set up proper error tracking and logging.</p>
      `,
      categoryIndex: 0, // Technology
      author: {
        name: "Alex Thompson",
        slug: "alex-thompson",
        bio: "Full-stack developer and tech writer",
      },
      publishedAt: "2025-01-22",
      readTime: "10 min read",
    },
  };

  const post = postData[slug];

  if (!post) {
    // Default fallback
    return {
      title: slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      slug,
      excerpt: "This is a sample blog post excerpt.",
      description: "This is a sample blog post description.",
      content: `<p>This is placeholder content for the blog post: ${slug}. In production, this will be fetched from the backend API.</p>`,
      category: categories[0],
      author: {
        name: "John Doe",
        slug: "john-doe",
        bio: "Expert writer and content creator",
      },
      publishedAt: "2025-01-15",
      readTime: "8 min read",
      hashtags: ["#Blog", "#Article"],
      keywords: ["blog", "article", "content"],
      image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
    };
  }

  // Map different post types to appropriate Pexels images
  const imageMap: Record<string, string> = {
    "top-10-ai-tools-for-content-creation-in-2025": "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
    "complete-guide-to-content-marketing-for-bloggers": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
    "how-to-build-a-successful-tech-startup-in-2025": "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
    "top-10-sports-trends-2025": "https://images.pexels.com/photos/863926/pexels-photo-863926.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
  };

  return {
    title: post.title,
    slug,
    excerpt: post.excerpt,
    description: post.description || post.excerpt,
    content: post.content,
    category: categories[post.categoryIndex] || categories[0],
    author: post.author,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    hashtags: post.hashtags || [],
    keywords: post.keywords || [],
    image: imageMap[slug] || "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
  };
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com";

  return {
    title: `${post.title} | The Modern Quill`,
    description: post.description || post.excerpt,
    keywords: post.keywords?.join(", ") || "",
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      tags: post.hashtags?.map((tag) => tag.replace("#", "")) || [],
      siteName: "The Modern Quill",
      url: `${baseUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.excerpt,
      images: [post.image],
      creator: "@themodernquill",
    },
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    other: {
      "article:tag": post.hashtags?.join(", ") || "",
      "article:author": post.author.name,
      "article:section": post.category.name,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Related posts (will come from backend)
  const relatedPosts = [
    {
      title: "Related Article Title 1",
      slug: "related-article-1",
      excerpt: "This is a related article excerpt.",
      image: "https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      readTime: "5 min read",
    },
    {
      title: "Related Article Title 2",
      slug: "related-article-2",
      excerpt: "This is another related article excerpt.",
      image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      readTime: "7 min read",
    },
    {
      title: "Related Article Title 3",
      slug: "related-article-3",
      excerpt: "This is a third related article excerpt.",
      image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      readTime: "6 min read",
    },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://themodernquill.com";

  // Breadcrumb Schema for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.category.name,
        item: `${baseUrl}/category/${post.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };

  // Article Schema for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || post.excerpt,
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
    keywords: post.keywords?.join(", ") || "",
    articleSection: post.category.name,
    wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
    inLanguage: "en-US",
  };

  return (
    <>
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <article className="space-y-8">
        {/* Breadcrumb */}
      <nav className="text-sm text-slate-600" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-orange-600 transition">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/category/${post.category.slug}`}
              className="hover:text-orange-600 transition"
            >
              {post.category.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-slate-900 font-medium line-clamp-1">
            {post.title}
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/category/${post.category.slug}`}
            className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700 hover:bg-orange-200 transition"
          >
            {post.category.name}
          </Link>
          <span className="text-sm text-slate-500">{post.readTime}</span>
          <span className="text-sm text-slate-500">{post.publishedAt}</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          {post.title}
        </h1>
        <p className="text-xl text-slate-600">{post.description || post.excerpt}</p>
        
        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 hover:bg-orange-100 transition"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {post.author.name.charAt(0)}
            </span>
          </div>
          <div>
            <Link
              href={`/author/${post.author.slug}`}
              className="font-semibold text-slate-900 hover:text-orange-600 transition"
            >
              {post.author.name}
            </Link>
            <p className="text-sm text-slate-600">{post.author.bio}</p>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative h-96 w-full overflow-hidden rounded-2xl">
        <Image
          src={post.image}
          alt={`${post.title} - Featured image showing ${post.category.name.toLowerCase()} content`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-slate max-w-none">
        <div
          className="space-y-6 text-base leading-relaxed text-slate-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
          itemProp="articleBody"
        />
      </div>

      {/* Related Posts */}
      <section className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          Related Articles
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedPosts.map((relatedPost) => (
            <Link
              key={relatedPost.slug}
              href={`/blog/${relatedPost.slug}`}
              className="group rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-slate-200">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <span className="text-sm font-medium text-slate-500">
                    Image
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-orange-600 transition">
                  {relatedPost.title}
                </h3>
                <p className="mb-2 text-sm text-slate-600 line-clamp-2">
                  {relatedPost.excerpt}
                </p>
                <span className="text-xs text-slate-500">
                  {relatedPost.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </article>
    </>
  );
}

