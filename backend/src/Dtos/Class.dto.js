import { z } from "zod"; // Importa Zod para validación de datos

export const createClassSchema = z.object({
  professorId: z.string().uuid("Invalid professor ID"), // ID de profesor válido
  subjectId: z.string().uuid("Invalid subject ID"), // ID de materia válido
  semester: z.string().min(1, "Semester is required"), // Semestre obligatorio
  group: z.string().min(1, "Group is required"), // Grupo obligatorio
});
