// src/services/auth.service.js
import bcrypt from "bcrypt"; // Importa bcrypt para cifrar contraseñas
import jwt from "jsonwebtoken"; // Importa JWT para generar tokens
import prisma from "../config/prisma.js"; // Importa el cliente Prisma

export const registerUser = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } }); // Busca si el email ya existe
  if (existing) {
    const error = new Error("Email already in use"); // Crea error si ya hay usuario
    error.statusCode = 409;
    throw error; // Lanza error para que el controlador lo maneje
  }

  const hashed = await bcrypt.hash(password, 10); // Hashea la contraseña con salt
  const user = await prisma.user.create({ // Crea el usuario en la base de datos
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, role: true, createdAt: true }, // Selecciona solo campos públicos
  });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // El token expira en 7 días
  });

  return { user, token }; // Devuelve el usuario y el token
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } }); // Busca usuario por email
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error; // Usuario no encontrado
  }

  const valid = await bcrypt.compare(password, user.password); // Compara la contraseña con la hash
  if (!valid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error; // Contraseña incorrecta
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Genera un nuevo token JWT
  });

  const { password: _, ...safeUser } = user; // Elimina la contraseña del objeto devuelto
  return { user: safeUser, token }; // Devuelve usuario seguro y token
};

export const getMe = async (userId) => {
  return await prisma.user.findUnique({ // Busca el usuario por su ID
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true }, // Devuelve solo campos públicos
  });
};
