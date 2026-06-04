// src/api/subject.api.ts
// Llamadas para obtener materias y detalles de una materia.
import { client } from "./client";
import type { Subject } from "./types";

export const subjectApi = {
  getAll: (search?: string) =>
    client.get<Subject[]>(`/subjects${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  getById: (id: string) => client.get<Subject>(`/subjects/${id}`),
};