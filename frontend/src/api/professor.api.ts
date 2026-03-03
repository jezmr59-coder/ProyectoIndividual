import { client } from "./client";
import type { Professor } from "./types";

export const professorApi = {
  getAll: (search?: string) =>
    client.get<Professor[]>(`/professors${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  getById: (id: string) =>
    client.get<Professor & { classes: import("./types").ClassSummary[] }>(`/professors/${id}`),
};