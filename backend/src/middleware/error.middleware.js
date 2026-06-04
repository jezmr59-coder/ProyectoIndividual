// src/middleware/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  // Log del error en consola para debugging
  console.error("[ERROR]", err.message, err.stack);

  if (err.name === "ZodError") {
    return res.status(400).json({ // Si la validación Zod falla, responde 400
      errors: err.errors,
    });
  }

  // Si es un error de multer, devuelve 400
  if (err instanceof Error && err.message.includes("Solo se permiten archivos")) {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(500).json({ // Para otros errores, responde 500
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
