import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendResponse } from '../responses/helpers/SendDefaultResponse';
import { StatusCodes } from 'http-status-codes';

export const validateRequestFormat = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendResponse(res, {
      success: false,
      message: 'Error de validación',
      error: errors.array(),
      statusCode: StatusCodes.BAD_REQUEST
    });
    return;
  }
  next();
};