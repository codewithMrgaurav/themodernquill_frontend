const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      index: true, // This creates the index, so we don't need the separate index() call
    },
    password: {
      type: String,
      required: false, // Password is optional for email-only login
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
      default: "no-password", // Default value for email-only users
    },
    role: {
      type: String,
      enum: ["user", "author", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Email index is already created by unique: true above
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

userSchema.pre("save", async function (next) {
  // Only hash password if it's provided and modified
  if (!this.isModified("password") || !this.password || this.password === "no-password") {
    // Skip password hashing if password is not modified or is "no-password"
    if (next) {
      return next();
    }
    return;
  }
  
  try {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 12);
    if (next) {
      return next();
    }
  } catch (error) {
    if (next) {
      return next(error);
    }
    throw error;
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password || this.password === "no-password") {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

