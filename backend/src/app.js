import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
import professorRoutes from "./routes/professor.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import classRoutes from "./routes/class.routes.js";
import noteRoutes from "./routes/note.routes.js";
import reactionRoutes from "./routes/reaction.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/reactions", reactionRoutes);

app.use(errorHandler);

export default app;