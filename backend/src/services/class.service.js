// src/services/class.service.js
import prisma from "../config/prisma.js";

const withStats = (c) => {
  const avgDifficulty = c.notes.length
    ? c.notes.reduce((acc, n) => acc + n.difficulty, 0) / c.notes.length
    : null;
  const recommendPct = c.notes.length
    ? (c.notes.filter((n) => n.recommendation).length / c.notes.length) * 100
    : null;
  const { notes, ...rest } = c;
  return { ...rest, totalReviews: notes.length, avgDifficulty, recommendPct };
};

export const getAllClasses = async ({ semester, professorId, subjectId } = {}) => {
  const classes = await prisma.class.findMany({
    where: {
      ...(semester ? { semester } : {}),
      ...(professorId ? { professorId } : {}),
      ...(subjectId ? { subjectId } : {}),
    },
    include: {
      professor: true,
      subject: true,
      notes: { select: { difficulty: true, recommendation: true } },
    },
    orderBy: [{ semester: "desc" }, { group: "asc" }],
  });

  return classes.map(withStats);
};

export const getClassById = async (id) => {
  const c = await prisma.class.findUnique({
    where: { id },
    include: {
      professor: true,
      subject: true,
      notes: {
        include: {
          user: { select: { id: true, name: true } },
          reactions: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!c) return null;

  const avgDifficulty = c.notes.length
    ? c.notes.reduce((acc, n) => acc + n.difficulty, 0) / c.notes.length
    : null;
  const recommendPct = c.notes.length
    ? (c.notes.filter((n) => n.recommendation).length / c.notes.length) * 100
    : null;

  return {
    ...c,
    stats: { totalReviews: c.notes.length, avgDifficulty, recommendPct },
  };
};

export const getSemesters = async () => {
  const classes = await prisma.class.findMany({
    select: { semester: true },
    distinct: ["semester"],
    orderBy: { semester: "desc" },
  });
  return classes.map((c) => c.semester);
};

export const createClass = async (data) => {
  return await prisma.class.create({
    data,
    include: { professor: true, subject: true },
  });
};

export const deleteClass = async (id) => {
  return await prisma.class.delete({ where: { id } });
};