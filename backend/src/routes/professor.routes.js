import { Router } from "express";
import {
  getProfessors,
  getProfessor,
  createNewProfessor,
  updateExistingProfessor,
  removeExistingProfessor,
} from "../controllers/professor.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getProfessors);
router.get("/:id", getProfessor);
router.post("/", authMiddleware, adminMiddleware, createNewProfessor);
router.put("/:id", authMiddleware, adminMiddleware, updateExistingProfessor);
router.delete("/:id", authMiddleware, adminMiddleware, removeExistingProfessor);

export default router;