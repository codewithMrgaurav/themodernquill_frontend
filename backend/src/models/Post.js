const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    content: {
      type: String,
    },
    contentBlocks: {
      type: [
        {
          type: {
            type: String,
            required: true,
            enum: [
              "paragraph",
              "heading",
              "image",
              "video",
              "code",
              "quote",
              "list",
              "table",
              "divider",
              "embed",
              "gallery",
              "custom",
            ],
          },
          data: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
          },
          order: {
            type: Number,
            default: 0,
          },
          id: {
            type: String,
            default: () => Math.random().toString(36).substring(2, 15),
          },
        },
      ],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      required: [true, "Featured image is required"],
    },
    hashtags: [
      {
        type: String,
        trim: true,
      },
    ],
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    readTime: {
      type: String,
      default: "5 min read",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    parentPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    brandingImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrandingImage",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.index({ category: 1 });
postSchema.index({ status: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ isFeatured: 1 });
postSchema.index({ parentPost: 1 });
postSchema.index({ brandingImage: 1 });

// Virtual for formatted date
postSchema.virtual("formattedDate").get(function () {
  return this.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Virtual for subposts
postSchema.virtual("subposts", {
  ref: "Post",
  localField: "_id",
  foreignField: "parentPost",
});

module.exports = mongoose.model("Post", postSchema);

