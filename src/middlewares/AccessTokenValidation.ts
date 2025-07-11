import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../responses/helpers/SendDefaultResponse';
import { AccessTokenModel } from '../models/AccessToken';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, {
      success: false,
      message: 'Token inválido',
      statusCode: StatusCodes.UNAUTHORIZED,
      error: null
    });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const accessTokenEnBD = await AccessTokenModel.findOne({ token });

    if (
      !accessTokenEnBD ||
      accessTokenEnBD.revoked ||
      accessTokenEnBD.expiresAt < new Date()
    ) {
      throw new Error('Token inválido');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
    req.user = payload;
    next();
  } catch (err: any) {
    return sendResponse(res, {
      success: false,
      message: 'Token inválido',
      statusCode: StatusCodes.UNAUTHORIZED,
      error: null
    });
  }
};