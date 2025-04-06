import { AppError } from "@src/helpers/AppError";
import logger from "@src/helpers/logger";
import { NextFunction, Request, Response } from "express";

export function errorMiddleware(err: AppError, req:Request, res: Response, next: NextFunction) {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  logger.error(`Reqiest failed: ${req.method} ${req.originalUrl} ${message} ${status} ${JSON.stringify(req.query)}, ${JSON.stringify(req.body)}}`)
  
  logger.error(err.stack)
  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}