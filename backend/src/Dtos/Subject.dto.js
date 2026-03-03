import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  code: z.string().min(2, "Code must have at least 2 characters"),
});

export const updateSubjectSchema = createSubjectSchema.partial();
