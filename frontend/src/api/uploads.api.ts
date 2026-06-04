// src/api/uploads.api.ts
// Funciones para subir archivos y listar trabajos almacenados en el backend.
import { client } from "./client";
import type { UploadItem } from "./types";

export const uploadApi = {
  list: () => client.get<UploadItem[]>("/uploads"),
  create: (file: File, description: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    return client.postForm<UploadItem>("/uploads", formData);
  },
};
