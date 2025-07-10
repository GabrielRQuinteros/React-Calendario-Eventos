import { body, param } from "express-validator";

export const userIdValidation = [
  param('id').isMongoId().withMessage('El id debe ser un ObjectId válido')
];

export const createUserValidations = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un string'),

  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

export const updateBodyUserValidations = [
  body('name')
    .optional()
    .isString().withMessage('El nombre debe ser un string'),

  body('email')
    .optional()
    .isEmail().withMessage('Debe ser un email válido'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

export const validateUserUpdate = [
  ...userIdValidation,
  ...updateBodyUserValidations
];

