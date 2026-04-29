import prisma from "../config/prisma.js";

export const getAllSubjects = async ({ search } = {}) => {
  return await prisma.subject.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { code: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { name: "asc" },
  });
};

export const getSubjectById = async (id) => {
  return await prisma.subject.findUnique({
    where: { id },
    include: {
      classes: {
        include: {
          professor: true,
          notes: { select: { difficulty: true, recommendation: true } },
        },
      },
    },
  });
};

export const createSubject = async (data) => {
  return await prisma.subject.create({ data });
};

export const updateSubject = async (id, data) => {
  return await prisma.subject.update({ where: { id }, data });
};

export const deleteSubject = async (id) => {
  return await prisma.subject.delete({ where: { id } });
};