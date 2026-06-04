import { z } from "zod"; // Importa Zod para validación de datos

export const createNoteSchema = z.object({
  classId: z.string().uuid("Invalid class ID"), // ID de clase válido
  difficulty: z.number().int().min(1).max(5), // Dificultad entre 1 y 5
  recommendation: z.boolean(), // Recomendación booleana
  comment: z.string().min(1).max(200, "Comment must be under 200 characters"), // Comentario con límite de 200
});

export const updateNoteSchema = createNoteSchema.omit({ classId: true }).partial(); // Permite actualizar campos parciales excepto classId
