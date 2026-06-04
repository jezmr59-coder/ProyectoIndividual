// src/controllers/Reaction.controller.js
import { toggleReactionSchema } from "../dtos/reaction.dto.js";
import { toggleReaction, getMyReactions } from "../services/reaction.service.js";

export const toggle = async (req, res, next) => {
  try {
    const { noteId, type } = toggleReactionSchema.parse(req.body);
    const result = await toggleReaction(req.user.id, noteId, type);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const myReactions = async (req, res, next) => {
  try {
    const noteIds = String(req.query.noteIds || "").split(",").filter(Boolean);
    const reactions = await getMyReactions(req.user.id, noteIds);
    res.json(reactions);
  } catch (error) {
    next(error);
  }
};