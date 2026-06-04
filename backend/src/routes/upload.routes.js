// src/routes/upload.routes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { listUploads, createNewUpload } from "../controllers/upload.controller.js";

const router = Router();
const uploadsDir = path.resolve("uploads");

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${suffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".zip" && ext !== ".rar") {
      cb(new Error("Solo se permiten archivos .zip y .rar"));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 30 * 1024 * 1024 },
});

router.get("/", authMiddleware, listUploads);
router.post("/", authMiddleware, upload.single("file"), createNewUpload);

export default router;
