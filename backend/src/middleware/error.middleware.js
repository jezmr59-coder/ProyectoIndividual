export const errorHandler = (err, req, res, next) => {
  if (err.name === "ZodError") {
    return res.status(400).json({
      errors: err.errors,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
};