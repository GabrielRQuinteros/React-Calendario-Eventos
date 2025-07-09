import { param } from "express-validator";

export const userIdValidation = [
  param('id').isMongoId().withMessage('El id debe ser un ObjectId válido')
];