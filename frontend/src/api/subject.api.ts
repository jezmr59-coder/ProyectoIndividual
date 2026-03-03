import { client } from "./client";
import type { Subject } from "./types";

export const subjectApi = {
  getAll: (search?: string) =>
    client.get<Subject[]>(`/subjects${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  getById: (id: string) => client.get<Subject>(`/subjects/${id}`),
};