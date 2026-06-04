// src/routes/class.routes.js
import { Router } from "express";
import {
  getClasses,
  getClass,
  getAvailableSemesters,
  createNewClass,
  removeExistingClass,
} from "../controllers/Class.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// /semesters debe ir ANTES de /:id para que no lo capture como id
router.get("/semesters", getAvailableSemesters);
router.get("/", getClasses);
router.get("/:id", getClass);
router.post("/", authMiddleware, adminMiddleware, createNewClass);
router.delete("/:id", authMiddleware, adminMiddleware, removeExistingClass);

export default router;