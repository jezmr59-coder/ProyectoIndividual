import { z } from "zod"; // Importa Zod para validación de datos

export const createUploadSchema = z.object({
  description: z.string().max(220).optional(), // Descripción opcional del archivo cargado
});
