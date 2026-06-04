import { z } from "zod"; // Importa Zod para validación de datos

export const createProfessorSchema = z.object({
  name: z.string().min(3, "Name must have at least 3 characters"), // Nombre del profesor
  department: z.string().min(2, "Department must have at least 2 characters"), // Departamento o facultad
});

export const createReviewSchema = z.object({
  classId: z.string().uuid("Invalid class ID"), // ID de clase válido para la reseña
  difficulty: z.number().int().min(1).max(10), // Dificultad de 1 a 10
  recommendation: z.boolean(), // Recomendación booleana
  comment: z.string().min(1).max(200), // Comentario obligatorio con límite
});

export const updateProfessorSchema = createProfessorSchema.partial(); // Permite actualizar campos parciales del profesor
