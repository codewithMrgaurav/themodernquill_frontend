const { searchImages, getImageById } = require("../utils/pexels");
const BrandingImage = require("../models/BrandingImage");
const { sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");
const https = require("https");
const fs = require("fs").promises;
const path = require("path");
const sizeOf = require("image-size");

async function searchPexelsImages(req, res) {
  try {
    const { query, perPage = 20, page = 1, orientation = "all", size = "all", color = "all" } = req.query;

    if (!query || !query.trim()) {
      return sendError(res, "Search query is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const results = await searchImages(query, {
      perPage: parseInt(perPage),
      page: parseInt(page),
      orientation,
      size,
      color,
    });

    const formattedResults = {
      totalResults: results.total_results,
      page: results.page,
      perPage: results.per_page,
      photos: results.photos.map((photo) => ({
        id: photo.id,
        width: photo.width,
        height: photo.height,
        url: photo.url,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        src: {
          original: photo.src.original,
          large: photo.src.large,
          large2x: photo.src.large2x,
          medium: photo.src.medium,
          small: photo.src.small,
          portrait: photo.src.portrait,
          landscape: photo.src.landscape,
          tiny: photo.src.tiny,
        },
      })),
    };

    return sendSuccess(res, formattedResults, "Images fetched successfully");
  } catch (error) {
    console.error("Error searching Pexels images:", error);
    return sendError(res, error.message || "Failed to search images", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getPexelsImage(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, "Image ID is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const photo = await getImageById(id);

    const formattedResult = {
      id: photo.id,
      width: photo.width,
      height: photo.height,
      url: photo.url,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      src: {
        original: photo.src.original,
        large: photo.src.large,
        large2x: photo.src.large2x,
        medium: photo.src.medium,
        small: photo.src.small,
        portrait: photo.src.portrait,
        landscape: photo.src.landscape,
        tiny: photo.src.tiny,
      },
    };

    return sendSuccess(res, formattedResult, "Image fetched successfully");
  } catch (error) {
    console.error("Error fetching Pexels image:", error);
    return sendError(res, error.message || "Failed to fetch image", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const urlModule = require("url");
    const protocol = url.startsWith("https") ? https : http;

    const parsedUrl = urlModule.parse(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: "GET",
    };

    protocol
      .get(options, (response) => {
        if (response.statusCode === 200) {
          const fileStream = require("fs").createWriteStream(filePath);
          response.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            resolve(filePath);
          });
          fileStream.on("error", (error) => {
            fs.unlink(filePath).catch(() => {});
            reject(error);
          });
        } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            const absoluteUrl = urlModule.resolve(url, redirectUrl);
            downloadImage(absoluteUrl, filePath).then(resolve).catch(reject);
          } else {
            reject(new Error(`Redirect without location header: ${response.statusCode}`));
          }
        } else {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function savePexelsImageToBranding(req, res) {
  try {
    const { pexelsId, name, description, category, tags, imageSize = "large" } = req.body;

    if (!pexelsId) {
      return sendError(res, "Pexels image ID is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    if (!name || !name.trim()) {
      return sendError(res, "Image name is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const photo = await getImageById(pexelsId);

    const imageUrl = photo.src[imageSize] || photo.src.large || photo.src.original;
    const imageExtension = path.extname(new URL(imageUrl).pathname) || ".jpg";

    const uploadsDir = path.join(process.cwd(), "uploads", "branding-images");
    await fs.mkdir(uploadsDir, { recursive: true });

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `pexels-${pexelsId}-${uniqueSuffix}${imageExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    const relativePath = path.relative(process.cwd(), filePath);

    await downloadImage(imageUrl, filePath);

    const stats = await fs.stat(filePath);
    let width = photo.width;
    let height = photo.height;

    try {
      const dimensions = sizeOf(filePath);
      width = dimensions.width;
      height = dimensions.height;
    } catch (error) {
      console.warn("Could not determine image dimensions:", error.message);
    }

    const imageData = {
      name: name.trim(),
      description: description?.trim() || `Image by ${photo.photographer} from Pexels`,
      imageUrl: `/uploads/branding-images/${fileName}`,
      imagePath: relativePath,
      fileName: `pexels-${pexelsId}${imageExtension}`,
      fileSize: stats.size,
      mimeType: imageExtension === ".jpg" || imageExtension === ".jpeg" ? "image/jpeg" : imageExtension === ".png" ? "image/png" : imageExtension === ".webp" ? "image/webp" : "image/jpeg",
      width,
      height,
      category: category || "other",
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : ["pexels"],
      isActive: true,
    };

    const brandingImage = await BrandingImage.create(imageData);

    await BrandingImage.findByIdAndUpdate(brandingImage._id, {
      $inc: { usageCount: 1 },
      $set: { lastUsedAt: new Date() },
    });

    return sendSuccess(res, brandingImage.toObject(), "Image saved to branding images successfully", HTTP_STATUS.CREATED);
  } catch (error) {
    console.error("Error saving Pexels image to branding:", error);
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    return sendError(res, error.message || "Failed to save image", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  searchPexelsImages,
  getPexelsImage,
  savePexelsImageToBranding,
};

