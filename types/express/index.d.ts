import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { uid: string; name: string; email: string } & JwtPayload;
    }
  }
}

export {};