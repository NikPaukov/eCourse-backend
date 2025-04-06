// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../services/auth.service';
import { TypedRequest } from '@src/types/web';
import { UserService } from '@src/services/user.service';
import { AppError } from '@src/helpers/AppError';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = jwtService.extractTokenFromHeader(req.headers.authorization);
    const decoded = await jwtService.verifyAccessToken(token);
    const user = await UserService.findUser({id:decoded.id});
    if(!user) throw new AppError('User not found', 401);
    // Attach user to request
    (req as TypedRequest).user = {
      id: decoded.id,
      email: decoded.email
    };
    
    next();
  } catch (err) {
    next(err);
  }
};