// src/routes/note.routes.js
import { Router } from "express";
import {
  getNotes,
  createNewNote,
  updateExistingNote,
  removeExistingNote,
} from "../controllers/note.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getNotes);
router.post("/", authMiddleware, createNewNote);
router.put("/:id", authMiddleware, updateExistingNote);
router.delete("/:id", authMiddleware, removeExistingNote);

export default router;