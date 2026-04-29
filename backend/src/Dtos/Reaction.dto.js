import { z } from "zod";

export const toggleReactionSchema = z.object({
  noteId: z.string().uuid("Invalid note ID"),
  type: z.enum(["USEFUL", "NOT_USEFUL"]),
});