// src/api/auth.api.ts
// Funciones para llamar a los endpoints de autenticación del backend.
import { client, setToken, clearToken } from "./client"; // Importa funciones de cliente HTTP y manejo de token
import type { AuthResponse, User } from "./types"; // Importa tipos de datos

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await client.post<AuthResponse>("/auth/login", { email, password }); // Envía credentials al backend
    setToken(data.token); // Guarda el token recibido
    return data; // Devuelve datos de autenticación
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const data = await client.post<AuthResponse>("/auth/register", { name, email, password }); // Crea un nuevo usuario
    setToken(data.token); // Guarda el token de la nueva sesión
    return data; // Devuelve datos de autenticación
  },

  me: () => client.get<User>("/auth/me"), // Solicita datos del usuario autenticado

  logout: () => {
    clearToken(); // Borra el token local para cerrar sesión
  },
};
