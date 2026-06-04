// src/controllers/Auth.controller.js
import { registerSchema, loginSchema } from "../dtos/auth.dto.js"; // Importa esquemas de validación
import { registerUser, loginUser, getMe } from "../services/auth.service.js"; // Importa servicios de auth

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body); // Valida los datos enviados en req.body
    const result = await registerUser(validatedData); // Crea el nuevo usuario
    res.status(201).json(result); // Envía respuesta 201 con el usuario y token
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message }); // Maneja errores con status personalizado
    next(error); // Pasa el error al middleware global
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body); // Valida los datos de login
    const result = await loginUser(validatedData); // Intenta autenticar al usuario
    res.json(result); // Envía token y usuario seguro
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message }); // Maneja error de credenciales
    next(error); // Pasa el error al middleware global
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await getMe(req.user.id); // Busca el usuario actual por ID
    if (!user) return res.status(404).json({ message: "User not found" }); // Responde 404 si no existe
    res.json(user); // Envía los datos del usuario
  } catch (error) {
    next(error); // Pasa errores inesperados al middleware
  }
};
