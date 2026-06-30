import multer from "multer";

const storage = multer.memoryStorage();

export const mediaUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
});
