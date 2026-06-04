// src/app.js
import fs from "fs"; // Importa el módulo de filesystem para manejar carpetas y archivos
import path from "path"; // Importa el módulo de rutas para resolver la carpeta uploads
import express from "express"; // Importa Express para crear el servidor y manejar rutas
import cors from "cors"; // Importa CORS para permitir peticiones desde otro origen
import { errorHandler } from "./middleware/error.middleware.js"; // Importa el middleware global de errores
import professorRoutes from "./routes/professor.routes.js"; // Importa las rutas de profesores
import subjectRoutes from "./routes/subject.routes.js"; // Importa las rutas de materias
import classRoutes from "./routes/class.routes.js"; // Importa las rutas de clases
import noteRoutes from "./routes/note.routes.js"; // Importa las rutas de notas
import reactionRoutes from "./routes/reaction.routes.js"; // Importa las rutas de reacciones
import authRoutes from "./routes/auth.routes.js"; // Importa las rutas de autenticación
import uploadRoutes from "./routes/upload.routes.js"; // Importa las rutas de subida de archivos

const app = express(); // Crea una instancia de la aplicación Express
const uploadsDir = path.resolve("uploads"); // Resuelve la ruta absoluta de la carpeta uploads
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true }); // Crea la carpeta uploads si no existe

app.use(cors()); // Permite peticiones CORS desde el frontend
app.use(express.json()); // Habilita el parseo automático de JSON en el cuerpo de las solicitudes
app.use("/uploads", express.static(uploadsDir)); // Sirve archivos estáticos desde la carpeta uploads

app.use("/api/auth", authRoutes); // Monta las rutas de autenticación
app.use("/api/professors", professorRoutes); // Monta las rutas de profesores
app.use("/api/subjects", subjectRoutes); // Monta las rutas de materias
app.use("/api/classes", classRoutes); // Monta las rutas de clases
app.use("/api/notes", noteRoutes); // Monta las rutas de notas
app.use("/api/reactions", reactionRoutes); // Monta las rutas de reacciones
app.use("/api/uploads", uploadRoutes); // Monta las rutas de archivos subidos

app.use(errorHandler); // Añade el middleware de manejo de errores al final

export default app; // Exporta la aplicación Express para usar en server.js
