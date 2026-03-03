import { client, setToken, clearToken } from "./client";
import type { AuthResponse, User } from "./types";

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await client.post<AuthResponse>("/auth/login", { email, password });
    setToken(data.token);
    return data;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const data = await client.post<AuthResponse>("/auth/register", { name, email, password });
    setToken(data.token);
    return data;
  },

  me: () => client.get<User>("/auth/me"),

  logout: () => {
    clearToken();
  },
};