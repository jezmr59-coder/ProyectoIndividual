// src/middleware/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  if (err.name === "ZodError") {
    return res.status(400).json({ // Si la validación Zod falla, responde 400
      errors: err.errors,
    });
  }

  res.status(500).json({ // Para otros errores, responde 500
    message: "Internal Server Error",
  });
};
