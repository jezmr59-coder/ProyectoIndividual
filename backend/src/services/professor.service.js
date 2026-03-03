import prisma from "../config/prisma.js";

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
    const allNotes = prof.classes.flatMap((c) => c.notes);
    return {
      id: prof.id,
      name: prof.name,
      department: prof.department,
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

  const allNotes = professor.classes.flatMap((c) => c.notes);
  return {
    ...professor,
    stats: {
      totalReviews: allNotes.length,
      avgDifficulty: allNotes.length
        ? allNotes.reduce((acc, n) => acc + n.difficulty, 0) / allNotes.length
        : null,
      recommendPct: allNotes.length
        ? (allNotes.filter((n) => n.recommendation).length / allNotes.length) * 100
        : null,
    },
  };
};

export const createProfessor = async (data) => {
  return await prisma.professor.create({ data });
};

export const updateProfessor = async (id, data) => {
  return await prisma.professor.update({ where: { id }, data });
};

export const deleteProfessor = async (id) => {
  return await prisma.professor.delete({ where: { id } });
};