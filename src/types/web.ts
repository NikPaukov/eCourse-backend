import { Request, Response } from 'express';

export interface RequestUser {
    id: string,
    email: string
}
export interface TypedRequest extends Request {
    user: RequestUser;
  }