// src/controllers/upload.controller.js
import { createUploadSchema } from "../Dtos/upload.dto.js";
import { getAllUploads, createUpload } from "../services/upload.service.js";

export const listUploads = async (req, res, next) => {
  try {
    const uploads = await getAllUploads();
    const normalized = uploads.map((upload) => ({
      id: upload.id,
      originalName: upload.originalName,
      description: upload.description,
      fileUrl: `/uploads/${upload.storedName}`,
      contentType: upload.contentType,
      size: upload.size,
      createdAt: upload.createdAt,
    }));
    res.json(normalized);
  } catch (error) {
    next(error);
  }
};

export const createNewUpload = async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "No autorizado" });
    if (!file) return res.status(400).json({ message: "Archivo no proporcionado" });

    const parsed = createUploadSchema.parse(req.body);
    const upload = await createUpload({
      originalName: file.originalname,
      storedName: file.filename,
      description: parsed.description || "Sin descripción añadida.",
      contentType: file.mimetype,
      size: file.size,
      userId,
    });

    res.status(201).json({
      id: upload.id,
      originalName: upload.originalName,
      description: upload.description,
      fileUrl: `/uploads/${upload.storedName}`,
      contentType: upload.contentType,
      size: upload.size,
      createdAt: upload.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
