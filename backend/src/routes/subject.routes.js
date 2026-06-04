// src/routes/subject.routes.js
import { Router } from "express";
import {
  getSubjects,
  getSubject,
  createNewSubject,
  updateExistingSubject,
  removeExistingSubject,
} from "../controllers/subject.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getSubjects);
router.get("/:id", getSubject);
router.post("/", authMiddleware, adminMiddleware, createNewSubject);
router.put("/:id", authMiddleware, adminMiddleware, updateExistingSubject);
router.delete("/:id", authMiddleware, adminMiddleware, removeExistingSubject);

export default router;