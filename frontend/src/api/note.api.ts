// src/api/note.api.ts
// Funciones para manejar las notas de clase: listarlas, crearlas, actualizarlas y eliminarlas.
import { client } from "./client";
import type { Note } from "./types";

export const noteApi = {
  getByClass: (classId: string) =>
    client.get<Note[]>(`/notes?classId=${classId}`),

  create: (data: { classId: string; difficulty: number; recommendation: boolean; comment: string }) =>
    client.post<Note>("/notes", data),

  update: (id: string, data: Partial<{ difficulty: number; recommendation: boolean; comment: string }>) =>
    client.put<Note>(`/notes/${id}`, data),

  remove: (id: string) => client.delete(`/notes/${id}`),
};