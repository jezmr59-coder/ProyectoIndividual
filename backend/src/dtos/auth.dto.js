import { z } from "zod"; // Importa Zod para validación de datos

export const registerSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"), // Nombre obligatorio
  email: z.string().email("Invalid email"), // Correo válido
  password: z.string().min(6, "Password must have at least 6 characters"), // Contraseña con mínimo 6 caracteres
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"), // Correo válido
  password: z.string().min(1, "Password is required"), // Contraseña obligatoria
});
