const express = require("express");
const healthRoutes = require("./healthRoutes");
const postRoutes = require("./postRoutes");
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes");
const newsletterRoutes = require("./newsletterRoutes");
const brandingImageRoutes = require("./brandingImageRoutes");
const pexelsRoutes = require("./pexelsRoutes");
const engagementRoutes = require("./engagementRoutes");
const authRoutes = require("./authRoutes");
const navigationRoutes = require("./navigationRoutes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/categories", categoryRoutes);
router.use("/users", userRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/branding-images", brandingImageRoutes);
router.use("/pexels", pexelsRoutes);
router.use("/engagement", engagementRoutes);
router.use("/navigation", navigationRoutes);

module.exports = router;


