// src/controllers/Note.controller.js
import { createNoteSchema, updateNoteSchema } from "../Dtos/Note.dto.js";
import {
  getNotesByClass,
  createNote,
  updateNote,
  deleteNote,
} from "../services/note.service.js";

export const getNotes = async (req, res, next) => {
  try {
    const { classId } = req.query;
    if (!classId) return res.status(400).json({ message: "classId is required" });
    const notes = await getNotesByClass(classId);
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const createNewNote = async (req, res, next) => {
  try {
    const validatedData = createNoteSchema.parse(req.body);
    const note = await createNote(req.user.id, validatedData);
    res.status(201).json(note);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "You already left a note for this class" });
    }
    next(error);
  }
};

export const updateExistingNote = async (req, res, next) => {
  try {
    const validatedData = updateNoteSchema.parse(req.body);
    const note = await updateNote(req.params.id, req.user.id, validatedData);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    next(error);
  }
};

export const removeExistingNote = async (req, res, next) => {
  try {
    const note = await deleteNote(req.params.id, req.user.id, req.user.role);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    next(error);
  }
};