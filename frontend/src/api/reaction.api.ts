import { client } from "./client";
import type { Reaction } from "./types";

export const reactionApi = {
  toggle: (noteId: string, type: "USEFUL" | "NOT_USEFUL") =>
    client.post<{ action: string; reaction?: Reaction; type?: string }>("/reactions", { noteId, type }),

  getMine: (noteIds: string[]) =>
    client.get<Reaction[]>(`/reactions/my?noteIds=${noteIds.join(",")}`),
};