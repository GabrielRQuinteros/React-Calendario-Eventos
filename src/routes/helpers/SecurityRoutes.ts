import { RequestHandler } from 'express';
import { authenticateToken } from '../../middlewares/AccessTokenValidation';

// Ruta pública: no hace nada, solo continúa
export const publicRoute: RequestHandler = (_req, _res, next) => next();

// Ruta privada: aplica autenticación
export const privateRoute: RequestHandler = (req, res, next) => {
  return authenticateToken(req, res, next);
};