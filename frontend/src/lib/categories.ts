import { slugify } from "./utils";

export interface Category {
  name: string;
  slug: string;
  /**
   * Simple icon placeholder (e.g. emoji) for UI display.
   * Can be swapped to a full icon system later.
   */
  icon?: string;
  description?: string;
}

export const categories: Category[] = [
  {
    name: "Technology",
    slug: slugify("Technology"),
    icon: "💻",
    description: "Latest trends, tools, and insights from the world of modern technology and software.",
  },
  {
    name: "Artificial Intelligence",
    slug: slugify("Artificial Intelligence"),
    icon: "🤖",
    description: "Practical guides and explanations on AI, machine learning, and real-world use cases.",
  },
  {
    name: "Business",
    slug: slugify("Business"),
    icon: "📈",
    description: "Strategies, case studies, and ideas for building and growing modern businesses.",
  },
  {
    name: "Marketing",
    slug: slugify("Marketing"),
    icon: "📣",
    description: "Content, social, and digital marketing tactics to reach and engage your audience.",
  },
  {
    name: "Education",
    slug: slugify("Education"),
    icon: "🎓",
    description: "Learning methods, study tips, and resources for students and lifelong learners.",
  },
  {
    name: "Finance",
    slug: slugify("Finance"),
    icon: "💰",
    description: "Money management, investing basics, and personal finance guidance.",
  },
  {
    name: "Health",
    slug: slugify("Health"),
    icon: "❤️",
    description: "Wellness, mental health, and everyday habits for a healthier lifestyle.",
  },
  {
    name: "Travel",
    slug: slugify("Travel"),
    icon: "✈️",
    description: "Destination ideas, travel tips, and stories from around the world.",
  },
  {
    name: "Gaming",
    slug: slugify("Gaming"),
    icon: "🎮",
    description: "Game reviews, industry news, and tips for casual and competitive players.",
  },
  {
    name: "Startups",
    slug: slugify("Startups"),
    icon: "🚀",
    description: "Lessons, experiences, and playbooks from startup founders and operators.",
  },
  { name: "Design", slug: slugify("Design"), icon: "🎨", description: "Interface, product, and visual design inspiration and principles." },
  {
    name: "Programming",
    slug: slugify("Programming"),
    icon: "🧑‍💻",
    description: "Code examples, best practices, and tutorials across popular languages and stacks.",
  },
  {
    name: "Science",
    slug: slugify("Science"),
    icon: "🔬",
    description: "Explainers and updates on discoveries across physics, biology, and more.",
  },
  {
    name: "Lifestyle",
    slug: slugify("Lifestyle"),
    icon: "🌿",
    description: "Day-to-day habits, routines, and ideas for living a balanced life.",
  },
  {
    name: "Food",
    slug: slugify("Food"),
    icon: "🍽️",
    description: "Recipes, cooking tips, and stories for people who love good food.",
  },
  {
    name: "Fitness",
    slug: slugify("Fitness"),
    icon: "🏋️",
    description: "Workouts, movement tips, and healthy routines for every fitness level.",
  },
  {
    name: "Fashion",
    slug: slugify("Fashion"),
    icon: "👗",
    description: "Style ideas, outfit inspiration, and wardrobe basics for everyday wear.",
  },
  {
    name: "Music",
    slug: slugify("Music"),
    icon: "🎵",
    description: "New releases, artist spotlights, and playlists for every mood.",
  },
  {
    name: "Movies",
    slug: slugify("Movies"),
    icon: "🎬",
    description: "Film reviews, recommendations, and behind-the-scenes stories.",
  },
  {
    name: "Books",
    slug: slugify("Books"),
    icon: "📚",
    description: "Reading lists, book reviews, and highlights from fiction and non-fiction.",
  },
  {
    name: "Photography",
    slug: slugify("Photography"),
    icon: "📷",
    description: "Guides on cameras, composition, and editing for better photos.",
  },
  {
    name: "Sports",
    slug: slugify("Sports"),
    icon: "🏅",
    description: "Match analysis, trends, and stories from the world of sports.",
  },
  {
    name: "Politics",
    slug: slugify("Politics"),
    icon: "🏛️",
    description: "Context and explainers on current events and policy decisions.",
  },
  {
    name: "History",
    slug: slugify("History"),
    icon: "📜",
    description: "Stories and lessons from the past that still shape the present.",
  },
  {
    name: "Psychology",
    slug: slugify("Psychology"),
    icon: "🧠",
    description: "Everyday psychology, behavior, and how people think and make decisions.",
  },
  {
    name: "Environment",
    slug: slugify("Environment"),
    icon: "🌍",
    description: "Climate, sustainability, and ideas for protecting the planet.",
  },
  {
    name: "Automotive",
    slug: slugify("Automotive"),
    icon: "🚗",
    description: "Car reviews, maintenance tips, and technology shaping transportation.",
  },
  {
    name: "Real Estate",
    slug: slugify("Real Estate"),
    icon: "🏡",
    description: "Property basics, housing trends, and practical advice for buyers and renters.",
  },
  {
    name: "Entertainment",
    slug: slugify("Entertainment"),
    icon: "📺",
    description: "Highlights across TV, streaming, celebrities, and pop culture.",
  },
  {
    name: "News",
    slug: slugify("News"),
    icon: "📰",
    description: "Key headlines and summaries from stories that matter right now.",
  },
];

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

/**
 * Get category by name
 */
export function getCategoryByName(name: string): Category | undefined {
  return categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());
}

