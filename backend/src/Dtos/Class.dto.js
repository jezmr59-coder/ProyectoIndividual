import { z } from "zod";

export const createClassSchema = z.object({
  professorId: z.string().uuid("Invalid professor ID"),
  subjectId: z.string().uuid("Invalid subject ID"),
  semester: z.string().min(1, "Semester is required"),
  group: z.string().min(1, "Group is required"),
});
