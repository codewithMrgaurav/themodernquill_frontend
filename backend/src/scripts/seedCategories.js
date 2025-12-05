const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/Category");
const { connectDatabase, disconnectDatabase } = require("../config/database");

// Load environment variables
dotenv.config();

const categories = [
  {
    name: "Technology",
    slug: "technology",
    description: "Latest tech news, reviews, and insights about gadgets, software, and innovations",
    icon: "💻",
    isActive: true,
  },
  {
    name: "Programming",
    slug: "programming",
    description: "Coding tutorials, best practices, and programming language guides",
    icon: "⚙️",
    isActive: true,
  },
  {
    name: "Web Development",
    slug: "web-development",
    description: "Frontend, backend, and full-stack web development articles and tutorials",
    icon: "🌐",
    isActive: true,
  },
  {
    name: "Mobile Development",
    slug: "mobile-development",
    description: "iOS, Android, and cross-platform mobile app development guides",
    icon: "📱",
    isActive: true,
  },
  {
    name: "Data Science",
    slug: "data-science",
    description: "Machine learning, AI, data analysis, and big data insights",
    icon: "📊",
    isActive: true,
  },
  {
    name: "Design",
    slug: "design",
    description: "UI/UX design, graphic design, and creative design inspiration",
    icon: "🎨",
    isActive: true,
  },
  {
    name: "Business",
    slug: "business",
    description: "Entrepreneurship, startups, marketing, and business strategy",
    icon: "💼",
    isActive: true,
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Tips, tools, and strategies to boost your productivity and efficiency",
    icon: "⚡",
    isActive: true,
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Health, wellness, travel, and personal development content",
    icon: "🌟",
    isActive: true,
  },
  {
    name: "Science",
    slug: "science",
    description: "Scientific discoveries, research, and fascinating science facts",
    icon: "🔬",
    isActive: true,
  },
  {
    name: "Health & Fitness",
    slug: "health-fitness",
    description: "Nutrition, exercise, mental health, and wellness advice",
    icon: "💪",
    isActive: true,
  },
  {
    name: "Education",
    slug: "education",
    description: "Learning resources, educational content, and study tips",
    icon: "📚",
    isActive: true,
  },
  {
    name: "Finance",
    slug: "finance",
    description: "Personal finance, investing, budgeting, and financial planning",
    icon: "💰",
    isActive: true,
  },
  {
    name: "Travel",
    slug: "travel",
    description: "Travel guides, destination reviews, and adventure stories",
    icon: "✈️",
    isActive: true,
  },
  {
    name: "Food & Cooking",
    slug: "food-cooking",
    description: "Recipes, cooking tips, restaurant reviews, and food culture",
    icon: "🍳",
    isActive: true,
  },
  {
    name: "Photography",
    slug: "photography",
    description: "Photography techniques, gear reviews, and stunning photo galleries",
    icon: "📷",
    isActive: true,
  },
  {
    name: "Music",
    slug: "music",
    description: "Music reviews, artist interviews, and music industry news",
    icon: "🎵",
    isActive: true,
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Game reviews, gaming news, and esports coverage",
    icon: "🎮",
    isActive: true,
  },
  {
    name: "Books",
    slug: "books",
    description: "Book reviews, reading recommendations, and literary discussions",
    icon: "📖",
    isActive: true,
  },
  {
    name: "Movies & TV",
    slug: "movies-tv",
    description: "Movie reviews, TV show recommendations, and entertainment news",
    icon: "🎬",
    isActive: true,
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Sports news, match analysis, and athlete profiles",
    icon: "⚽",
    isActive: true,
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Fashion trends, style guides, and fashion industry news",
    icon: "👗",
    isActive: true,
  },
  {
    name: "Art & Culture",
    slug: "art-culture",
    description: "Art exhibitions, cultural events, and artistic inspiration",
    icon: "🖼️",
    isActive: true,
  },
  {
    name: "Environment",
    slug: "environment",
    description: "Climate change, sustainability, and environmental conservation",
    icon: "🌍",
    isActive: true,
  },
  {
    name: "History",
    slug: "history",
    description: "Historical events, ancient civilizations, and historical analysis",
    icon: "🏛️",
    isActive: true,
  },
];

async function seedCategories() {
  try {
    console.log("🔄 Connecting to database...");
    await connectDatabase();

    console.log("📝 Seeding categories...");
    
    let created = 0;
    let skipped = 0;

    for (const categoryData of categories) {
      try {
        // Check if category already exists
        const existing = await Category.findOne({ slug: categoryData.slug });
        
        if (existing) {
          console.log(`⏭️  Skipping "${categoryData.name}" - already exists`);
          skipped++;
          continue;
        }

        const category = await Category.create(categoryData);
        console.log(`✅ Created category: ${category.name} (${category.slug})`);
        created++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⏭️  Skipping "${categoryData.name}" - duplicate entry`);
          skipped++;
        } else {
          console.error(`❌ Error creating "${categoryData.name}":`, error.message);
        }
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📦 Total: ${categories.length}`);

    console.log("\n✅ Category seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
}

// Run the seed function
seedCategories();

