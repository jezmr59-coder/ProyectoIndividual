// src/routes/reaction.routes.js
import { Router } from "express";
import { toggle, myReactions } from "../controllers/reaction.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, toggle);
router.get("/my", authMiddleware, myReactions);

export default router;