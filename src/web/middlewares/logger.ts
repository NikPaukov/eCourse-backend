import { Request, Response, NextFunction } from 'express';
import logger from '@src/helpers/logger';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl} ${JSON.stringify(req.query)}, ${JSON.stringify(req.body)}`);
  next();
};
