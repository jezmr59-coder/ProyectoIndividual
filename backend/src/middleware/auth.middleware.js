// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken"; // Importa JWT para verificar tokens

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrae el token de la cabecera Authorization Bearer
  if (!token) return res.status(401).json({ message: "No token provided" }); // Si no existe token, responde 401

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token JWT
    req.user = decoded; // Añade los datos decodificados del usuario a req
    next(); // Continúa con la siguiente función
  } catch {
    res.status(401).json({ message: "Invalid token" }); // Si falla la verificación, responde 401
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" }); // Requiere rol ADMIN
  }
  next(); // Continúa si el usuario es admin
};
