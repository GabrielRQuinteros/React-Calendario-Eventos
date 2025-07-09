import { body, param } from 'express-validator';

export const calendarEventValidations = [
  body('title')
    .notEmpty().withMessage('El título es obligatorio')
    .isString().withMessage('El título debe ser un string'),

  body('start')
    .optional()
    .isISO8601().withMessage('La fecha de inicio debe ser una fecha válida (ISO8601)'),

  body('end')
    .optional()
    .isISO8601().withMessage('La fecha de fin debe ser una fecha válida (ISO8601)'),

  body('rrule')
    .optional()
    .isString().withMessage('La regla de recurrencia debe ser un string'),

  body('duration')
    .optional()
    .isObject().withMessage('La duración debe ser un objeto')
    .custom((value) => {
      if (value.hours !== undefined && typeof value.hours !== 'number') {
        throw new Error('duration.hours debe ser un número');
      }
      if (value.minutes !== undefined && typeof value.minutes !== 'number') {
        throw new Error('duration.minutes debe ser un número');
      }
      return true;
    }),

  body('allDay')
    .optional()
    .isBoolean().withMessage('allDay debe ser booleano'),

  body('note')
    .optional()
    .isString().withMessage('La nota debe ser un string'),

  body('user')
    .notEmpty().withMessage('El usuario es obligatorio')
    .isMongoId().withMessage('El usuario debe ser un ObjectId válido')
];

export const calendarEventIdValidation = [
  param('id')
    .notEmpty().withMessage('El id es obligatorio')
    .isMongoId().withMessage('El id debe ser un ObjectId válido')
];

export const validateCalendarEventUpdate = [
    ...calendarEventIdValidation, ...calendarEventValidations
]