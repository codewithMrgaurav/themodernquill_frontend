const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { connectDatabase, disconnectDatabase } = require("../config/database");

// Load environment variables
dotenv.config();

const adminUserData = {
  name: "Admin User",
  email: "admin@themodernquill.com",
  password: "Admin@123",
  role: "admin",
  isActive: true,
  isEmailVerified: true,
  bio: "Administrator of The Modern Quill",
};

async function seedAdminUser() {
  try {
    console.log("🔄 Connecting to database...");
    await connectDatabase();

    console.log("👤 Seeding admin user...");
    
    // Check if admin user already exists
    const existing = await User.findOne({ email: adminUserData.email });
    
    if (existing) {
      console.log(`⏭️  Admin user "${adminUserData.email}" already exists`);
      
      // Update to ensure it's an admin
      if (existing.role !== "admin") {
        existing.role = "admin";
        existing.isActive = true;
        existing.isEmailVerified = true;
        await existing.save();
        console.log(`✅ Updated user "${adminUserData.email}" to admin role`);
      } else {
        console.log(`✅ Admin user "${adminUserData.email}" is already configured correctly`);
      }
    } else {
      // Hash password manually
      const hashedPassword = await bcrypt.hash(adminUserData.password, 12);
      
      // Insert directly into database to bypass pre-save hook
      const userDoc = {
        name: adminUserData.name,
        email: adminUserData.email.toLowerCase(),
        password: hashedPassword,
        role: adminUserData.role,
        isActive: adminUserData.isActive,
        isEmailVerified: adminUserData.isEmailVerified,
        bio: adminUserData.bio,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await User.collection.insertOne(userDoc);
      
      // Fetch the created user to display
      const user = await User.findOne({ email: adminUserData.email.toLowerCase() });
      
      console.log(`✅ Created admin user: ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password: ${adminUserData.password}`);
      console.log(`   ⚠️  Please change the password after first login!`);
    }

    console.log("\n✅ Admin user seeding completed!");
    console.log("\n📝 Login credentials:");
    console.log(`   Email: ${adminUserData.email}`);
    console.log(`   Password: ${adminUserData.password}`);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
}

// Run the seed function
seedAdminUser();

