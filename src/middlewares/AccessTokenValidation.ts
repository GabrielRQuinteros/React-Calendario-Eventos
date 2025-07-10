import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../responses/helpers/SendDefaultResponse';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendResponse(res, {
      success: false,
      message: 'Token no proporcionado',
      statusCode: StatusCodes.UNAUTHORIZED,
      error: null
    });
    return;
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
    req.user = payload;
    next();
  } catch (err: any) {
    sendResponse(res, {
      success: false,
      message: 'Token inválido o expirado',
      statusCode: StatusCodes.UNAUTHORIZED,
      error: err.message || 'Invalid token'
    });
    return;
  }
};