import { z } from "zod"; // Importa Zod para validación de datos

export const toggleReactionSchema = z.object({
  noteId: z.string().uuid("Invalid note ID"), // ID de nota válido
  type: z.enum(["USEFUL", "NOT_USEFUL"]), // Tipo de reacción permitido
});
