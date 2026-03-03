import { z } from "zod";

export const createNoteSchema = z.object({
  classId: z.string().uuid("Invalid class ID"),
  difficulty: z.number().int().min(1).max(5),
  recommendation: z.boolean(),
  comment: z.string().min(1).max(200, "Comment must be under 200 characters"),
});

export const updateNoteSchema = createNoteSchema.omit({ classId: true }).partial();