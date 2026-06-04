// Cliente HTTP compartido para todas las llamadas al backend.
// Añade token de autenticación cuando existe y convierte cuerpos JSON automáticamente.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"; // Base URL para el API

export function getToken(): string | null {
  return localStorage.getItem("token"); // Lee el token almacenado en localStorage
}
export function setToken(token: string) {
  localStorage.setItem("token", token); // Guarda el token en localStorage
}
export function clearToken() {
  localStorage.removeItem("token"); // Elimina el token de localStorage
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken(); // Obtiene token actual
  const headers = new Headers(options?.headers); // Prepara cabeceras de la petición

  if (token) {
    headers.set("Authorization", `Bearer ${token}`); // Añade el token si existe
  }

  if (!(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json"); // Usa JSON salvo que sea FormData
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  }); // Realiza la petición HTTP

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Unknown error" })); // Intenta leer mensaje de error
    throw new Error(err.message ?? `HTTP ${res.status}`); // Lanza error si la respuesta no es OK
  }
  return res.json(); // Devuelve el JSON de la respuesta
}

export const client = {
  get: <T>(path: string) => request<T>(path), // GET simple
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }), // POST con JSON
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }), // PUT con JSON
  postForm: <T>(path: string, body: FormData) => request<T>(path, { method: "POST", body }), // POST de formulario
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }), // DELETE simple
};
