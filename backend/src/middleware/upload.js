const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const uploadsDir = path.join(process.cwd(), "uploads", "branding-images");

async function ensureUploadsDir() {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
}

ensureUploadsDir();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-");
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

const uploadSingle = upload.single("image");

function uploadBrandingImage(req, res, next) {
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            data: null,
            error: {
              message: "File size exceeds 10MB limit",
              code: "FILE_TOO_LARGE",
            },
          });
        }
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            message: err.message,
            code: "UPLOAD_ERROR",
          },
        });
      }
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          message: err.message,
          code: "UPLOAD_ERROR",
        },
      });
    }
    next();
  });
}

module.exports = {
  uploadBrandingImage,
};

