// src/services/upload.service.js
import prisma from "../config/prisma.js";

export const getAllUploads = async () => {
  return await prisma.workUpload.findMany({
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const createUpload = async ({ originalName, storedName, description, contentType, size, userId }) => {
  return await prisma.workUpload.create({
    data: {
      originalName,
      storedName,
      description,
      contentType,
      size,
      userId,
    },
  });
};
