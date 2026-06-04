import { z } from "zod"; // Importa Zod para validación de datos

export const createSubjectSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"), // Nombre de la materia
  code: z.string().min(2, "Code must have at least 2 characters"), // Código de materia
});

export const updateSubjectSchema = createSubjectSchema.partial(); // Permite actualizar campos parciales de la materia
