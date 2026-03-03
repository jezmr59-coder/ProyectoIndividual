import { client } from "./client";
import type { ClassSummary, ClassDetail } from "./types";

export const classApi = {
  getAll: (filters?: { semester?: string; professorId?: string; subjectId?: string }) => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters ?? {}).filter(([, v]) => v))
    ).toString();
    return client.get<ClassSummary[]>(`/classes${params ? `?${params}` : ""}`);
  },

  getById: (id: string) => client.get<ClassDetail>(`/classes/${id}`),

  getSemesters: () => client.get<string[]>("/classes/semesters"),
};