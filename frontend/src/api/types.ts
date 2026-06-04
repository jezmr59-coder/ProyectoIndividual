// src/api/types.ts
// Tipos compartidos entre frontend y llamadas de API.
// Define las estructuras de datos que se envían y reciben desde el backend.

// ── Auth ──────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ── Core entities ──────────────────────────────────────
export interface Professor {
  id: string;
  name: string;
  department: string;
  description: string;
  totalReviews: number;
  avgDifficulty: number | null;
  recommendPct: number | null;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface ClassSummary {
  id: string;
  semester: string;
  group: string;
  subject: Subject;
  professor: Professor;
  totalReviews: number;
  avgDifficulty: number | null;
  recommendPct: number | null;
}

export interface ClassDetail extends ClassSummary {
  notes: Note[];
  stats: {
    avgDifficulty: number | null;
    recommendPct: number | null;
    totalReviews: number;
  };
}

// ── Notes / Reactions ──────────────────────────────────
export interface Note {
  id: string;
  userId: string;
  classId: string;
  difficulty: number;
  recommendation: boolean;
  comment: string;
  createdAt: string;
  user: { id: string; name: string };
  reactions: Reaction[];
  usefulCount: number;
  notUsefulCount: number;
}

export interface Reaction {
  id: string;
  userId: string;
  noteId: string;
  type: "USEFUL" | "NOT_USEFUL";
}

export interface UploadItem {
  id: string;
  originalName: string;
  description: string;
  fileUrl: string;
  contentType: string;
  size: number;
  createdAt: string;
}