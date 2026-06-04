// src/api/professor.api.ts
// Funciones para acceder a profesores y enviar reseñas sobre ellos.
import { client } from "./client";
import type { Professor } from "./types";

export const professorApi = {
  getAll: (search?: string) =>
    client.get<Professor[]>(`/professors${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  getById: (id: string) =>
    client.get<Professor & { classes: import("./types").ClassSummary[] }>(`/professors/${id}`),

  createReview: (professorId: string, data: { classId: string; difficulty: number; recommendation: boolean; comment: string }) =>
    client.post(`/professors/${professorId}/reviews`, data),
};