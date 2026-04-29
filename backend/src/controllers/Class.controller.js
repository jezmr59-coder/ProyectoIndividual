import { createClassSchema } from "../Dtos/class.dto.js";
import {
  getAllClasses,
  getClassById,
  getSemesters,
  createClass,
  deleteClass,
} from "../services/class.service.js";

export const getClasses = async (req, res, next) => {
  try {
    const { semester, professorId, subjectId } = req.query;
    const classes = await getAllClasses({ semester, professorId, subjectId });
    res.json(classes);
  } catch (error) {
    next(error);
  }
};

export const getClass = async (req, res, next) => {
  try {
    const classData = await getClassById(req.params.id);
    if (!classData) return res.status(404).json({ message: "Class not found" });
    res.json(classData);
  } catch (error) {
    next(error);
  }
};

export const getAvailableSemesters = async (req, res, next) => {
  try {
    const semesters = await getSemesters();
    res.json(semesters);
  } catch (error) {
    next(error);
  }
};

export const createNewClass = async (req, res, next) => {
  try {
    const validatedData = createClassSchema.parse(req.body);
    const newClass = await createClass(validatedData);
    res.status(201).json(newClass);
  } catch (error) {
    next(error);
  }
};

export const removeExistingClass = async (req, res, next) => {
  try {
    await deleteClass(req.params.id);
    res.json({ message: "Class deleted" });
  } catch (error) {
    next(error);
  }
};