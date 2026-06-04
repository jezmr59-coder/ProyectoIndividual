// src/controllers/Subject.controller.js
import { createSubjectSchema, updateSubjectSchema } from "../Dtos/subject.dto.js";
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../services/subject.service.js";

export const getSubjects = async (req, res, next) => {
  try {
    const { search } = req.query;
    const subjects = await getAllSubjects({ search });
    res.json(subjects);
  } catch (error) {
    next(error);
  }
};

export const getSubject = async (req, res, next) => {
  try {
    const subject = await getSubjectById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

export const createNewSubject = async (req, res, next) => {
  try {
    const validatedData = createSubjectSchema.parse(req.body);
    const subject = await createSubject(validatedData);
    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

export const updateExistingSubject = async (req, res, next) => {
  try {
    const validatedData = updateSubjectSchema.parse(req.body);
    const subject = await updateSubject(req.params.id, validatedData);
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

export const removeExistingSubject = async (req, res, next) => {
  try {
    await deleteSubject(req.params.id);
    res.json({ message: "Subject deleted" });
  } catch (error) {
    next(error);
  }
};