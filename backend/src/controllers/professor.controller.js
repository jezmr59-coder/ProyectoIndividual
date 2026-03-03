import { createProfessorSchema, updateProfessorSchema } from "../Dtos/professor.dto.js";
import {
  getAllProfessors,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor,
} from "../services/professor.service.js";

export const getProfessors = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    const professors = await getAllProfessors({ search, department });
    res.json(professors);
  } catch (error) {
    next(error);
  }
};

export const getProfessor = async (req, res, next) => {
  try {
    const professor = await getProfessorById(req.params.id);
    if (!professor) return res.status(404).json({ message: "Professor not found" });
    res.json(professor);
  } catch (error) {
    next(error);
  }
};

export const createNewProfessor = async (req, res, next) => {
  try {
    const validatedData = createProfessorSchema.parse(req.body);
    const professor = await createProfessor(validatedData);
    res.status(201).json(professor);
  } catch (error) {
    next(error);
  }
};

export const updateExistingProfessor = async (req, res, next) => {
  try {
    const validatedData = updateProfessorSchema.parse(req.body);
    const professor = await updateProfessor(req.params.id, validatedData);
    res.json(professor);
  } catch (error) {
    next(error);
  }
};

export const removeExistingProfessor = async (req, res, next) => {
  try {
    await deleteProfessor(req.params.id);
    res.json({ message: "Professor deleted" });
  } catch (error) {
    next(error);
  }
};