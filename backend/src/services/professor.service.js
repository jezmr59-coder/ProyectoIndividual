// src/services/professor.service.js
import prisma from "../config/prisma.js"; // Importa el cliente Prisma

export const getAllProfessors = async ({ search, department } = {}) => {
  const professors = await prisma.professor.findMany({
    where: {
      ...(department ? { department } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    include: {
      classes: {
        include: {
          notes: { select: { difficulty: true, recommendation: true } },
        },
      },
    },
  });

  return professors.map((prof) => {
    const allNotes = prof.classes.flatMap((c) => c.notes); // Aplana todas las notas de las clases del profesor
    return {
      id: prof.id,
      name: prof.name,
      department: prof.department,
      description: prof.description,
      totalReviews: allNotes.length,
      avgDifficulty: allNotes.length
        ? allNotes.reduce((acc, n) => acc + n.difficulty, 0) / allNotes.length
        : null,
      recommendPct: allNotes.length
        ? (allNotes.filter((n) => n.recommendation).length / allNotes.length) * 100
        : null,
    };
  });
};

export const getProfessorById = async (id) => {
  const professor = await prisma.professor.findUnique({
    where: { id },
    include: {
      classes: {
        include: {
          subject: true,
          notes: {
            include: {
              user: { select: { id: true, name: true } },
              reactions: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!professor) return null;

  const classes = professor.classes.map((cls) => {
    const notes = cls.notes ?? [];
    const totalReviews = notes.length;
    return {
      ...cls,
      totalReviews,
      avgDifficulty: totalReviews
        ? notes.reduce((acc, n) => acc + n.difficulty, 0) / totalReviews
        : null,
      recommendPct: totalReviews
        ? (notes.filter((n) => n.recommendation).length / totalReviews) * 100
        : null,
    };
  });

  const allNotes = classes.flatMap((c) => c.notes); // Todos los comentarios de las clases
  const stats = {
    totalReviews: allNotes.length,
    avgDifficulty: allNotes.length
      ? allNotes.reduce((acc, n) => acc + n.difficulty, 0) / allNotes.length
      : null,
    recommendPct: allNotes.length
      ? (allNotes.filter((n) => n.recommendation).length / allNotes.length) * 100
      : null,
  };

  return {
    ...professor,
    classes,
    ...stats,
    stats,
  };
};

export const createReviewForProfessor = async ({ userId, classId, difficulty, recommendation, comment }) => {
  return await prisma.note.create({
    data: {
      userId,
      classId,
      difficulty,
      recommendation,
      comment,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

export const createProfessor = async (data) => {
  return await prisma.professor.create({ data }); // Crea un nuevo profesor
};

export const updateProfessor = async (id, data) => {
  return await prisma.professor.update({ where: { id }, data }); // Actualiza un profesor existente
};

export const deleteProfessor = async (id) => {
  return await prisma.professor.delete({ where: { id } }); // Elimina un profesor
};
