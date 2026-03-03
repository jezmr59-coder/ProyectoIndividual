import { z } from "zod";

export const createProfessorSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters"),
  department: z.string().min(2, "Department must have at least 2 characters"),
});

export const updateProfessorSchema = createProfessorSchema.partial();