import prisma from "../config/prisma.js";

export const toggleReaction = async (userId, noteId, type) => {
  const existing = await prisma.reaction.findUnique({
    where: { userId_noteId: { userId, noteId } },
  });

  if (existing) {
    if (existing.type === type) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      return { action: "removed", type };
    }
    const updated = await prisma.reaction.update({
      where: { id: existing.id },
      data: { type },
    });
    return { action: "updated", reaction: updated };
  }

  const reaction = await prisma.reaction.create({
    data: { userId, noteId, type },
  });
  return { action: "created", reaction };
};

export const getMyReactions = async (userId, noteIds) => {
  return await prisma.reaction.findMany({
    where: { userId, noteId: { in: noteIds } },
  });
};