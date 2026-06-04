// src/routes/auth.routes.js
import { Router } from "express"; // Importa Router de Express
import { register, login, me } from "../controllers/Auth.controller.js"; // Importa los controladores de auth
import { authMiddleware } from "../middleware/auth.middleware.js"; // Importa middleware de autenticación

const router = Router(); // Crea un nuevo router

router.post("/register", register); // Ruta para registrar nuevos usuarios
router.post("/login", login); // Ruta para iniciar sesión
router.get("/me", authMiddleware, me); // Ruta protegida para obtener datos del usuario actual

export default router; // Exporta el router de autenticación
