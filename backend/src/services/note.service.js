import prisma from "../config/prisma.js";

export const getNotesByClass = async (classId) => {
  const notes = await prisma.note.findMany({
    where: { classId },
    include: {
      user: { select: { id: true, name: true } },
      reactions: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return notes.map((note) => ({
    ...note,
    usefulCount: note.reactions.filter((r) => r.type === "USEFUL").length,
    notUsefulCount: note.reactions.filter((r) => r.type === "NOT_USEFUL").length,
  }));
};

export const createNote = async (userId, data) => {
  return await prisma.note.create({
    data: { userId, ...data },
    include: {
      user: { select: { id: true, name: true } },
      reactions: true,
    },
  });
};

export const updateNote = async (id, userId, data) => {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) return null;
  if (note.userId !== userId) {
    const error = new Error("Not your note");
    error.statusCode = 403;
    throw error;
  }

  return await prisma.note.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true } },
      reactions: true,
    },
  });
};

export const deleteNote = async (id, userId, role) => {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) return null;
  if (note.userId !== userId && role !== "ADMIN") {
    const error = new Error("Not authorized");
    error.statusCode = 403;
    throw error;
  }

  return await prisma.note.delete({ where: { id } });
};