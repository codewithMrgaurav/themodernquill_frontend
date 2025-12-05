import type { Category } from "@/lib/categories";

type CategoryIconProps = {
  category: Pick<Category, "slug" | "name">;
};

export function getCategoryColor(slug: string): string {
  if (slug === "technology" || slug === "programming") {
    return "border-sky-100 bg-sky-50 text-sky-600";
  }
  if (slug === "artificial-intelligence") {
    return "border-violet-100 bg-violet-50 text-violet-600";
  }
  if (slug === "business" || slug === "finance" || slug === "startups") {
    return "border-emerald-100 bg-emerald-50 text-emerald-600";
  }
  if (slug === "health" || slug === "fitness") {
    return "border-rose-100 bg-rose-50 text-rose-600";
  }
  if (slug === "travel") {
    return "border-sky-100 bg-sky-50 text-sky-600";
  }
  if (slug === "gaming") {
    return "border-indigo-100 bg-indigo-50 text-indigo-600";
  }
  if (slug === "food") {
    return "border-blue-100 bg-blue-50 text-blue-600";
  }
  if (slug === "music" || slug === "movies" || slug === "entertainment") {
    return "border-purple-100 bg-purple-50 text-purple-600";
  }
  if (slug === "books") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (slug === "sports") {
    return "border-lime-100 bg-lime-50 text-lime-600";
  }
  if (slug === "news" || slug === "politics") {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }
  if (slug === "design" || slug === "photography") {
    return "border-pink-100 bg-pink-50 text-pink-600";
  }
  if (slug === "environment") {
    return "border-green-100 bg-green-50 text-green-600";
  }
  if (slug === "automotive") {
    return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }
  if (slug === "real-estate") {
    return "border-cyan-100 bg-cyan-50 text-cyan-600";
  }

  // default neutral
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function CategoryIcon({ category }: CategoryIconProps) {
  const slug = category.slug;

  if (slug === "technology" || slug === "programming") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <rect
          x="3.5"
          y="5"
          width="17"
          height="12"
          rx="2"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M4 15h16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="9" cy="17.5" r="0.9" fill="currentColor" />
        <circle cx="15" cy="17.5" r="0.9" fill="currentColor" />
      </svg>
    );
  }

  if (slug === "artificial-intelligence") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <rect
          x="7"
          y="4"
          width="10"
          height="16"
          rx="3"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="9" r="1.3" fill="currentColor" />
        <rect
          x="9"
          y="12"
          width="6"
          height="3"
          rx="1"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    );
  }

  if (slug === "business" || slug === "finance") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <path
          d="M5 17.5 9.5 11l3 3.5L19 7"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 18.5h16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (slug === "health" || slug === "fitness") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <path
          d="M6.5 5.5C4.6 5.5 3 7.1 3 9c0 4.7 6.9 8.3 9 9.5 2.1-1.2 9-4.8 9-9.5 0-1.9-1.6-3.5-3.5-3.5-1.3 0-2.5.7-3.2 1.8C13.9 6.2 12.7 5.5 11.5 5.5Z"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (slug === "travel") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <path
          d="M5 19 8.5 9l4.5-1.5L15.5 5 19 5.5 15 10l1 4.5L12 14l-4 5Z"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (slug === "gaming") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <rect
          x="4"
          y="8.5"
          width="16"
          height="7"
          rx="2.5"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M9 10.5v3M7.5 12h3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="15.5" cy="11.5" r="0.7" fill="currentColor" />
        <circle cx="17.5" cy="13.5" r="0.7" fill="currentColor" />
      </svg>
    );
  }

  if (slug === "food") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <path
          d="M7 4v8M10 4v8M7 8h3M15 4.5c1.2 0 2.2 1 2.2 2.2C17.2 9.5 15 11 15 13.5V16"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M6 16h10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (slug === "music") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <path
          d="M9 6.5v9.3a2 2 0 1 1-2-2"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M9 6.5 17 5v7.8a2 2 0 1 1-2-2"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (slug === "movies" || slug === "entertainment") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <rect
          x="4"
          y="6"
          width="16"
          height="12"
          rx="2"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 6 9.5 9M12 6l1.5 3M16 6l1.5 3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (slug === "books") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <path
          d="M7.5 5H17a1 1 0 0 1 1 1v11H8.5A2.5 2.5 0 0 0 6 19.5V7a2 2 0 0 1 1.5-2Z"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M9 8h6M9 10.5h4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (slug === "sports") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <circle
          cx="12"
          cy="12"
          r="6.5"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M12 5.5v13M8 7.5c1.5 1.1 3.2 1.7 6.5 1.7M8 16.5c1.5-1.1 3.2-1.7 6.5-1.7"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (slug === "news" || slug === "politics") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-8 w-8"
      >
        <rect
          x="5"
          y="5"
          width="14"
          height="14"
          rx="2"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <rect
          x="8"
          y="8"
          width="5"
          height="3"
          rx="0.8"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M8 13h8M8 15.5h5.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Fallback generic icon
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-8 w-8"
    >
      <circle
        cx="12"
        cy="12"
        r="7"
        className="fill-none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9.5 10.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4"
        className="fill-none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </svg>
  );
}


