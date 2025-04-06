// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '@src/services/user.service';
import { jwtService } from '../../../../services/auth.service';
import { signUpSchema, loginSchema } from './auth.validation';
import { validateDto } from '../../../../helpers/validateRequest';
import { AppError } from '../../../../helpers/AppError';
import bcrypt from 'bcrypt';
import { UserResponseDto } from '../user/user.dto';

export class AuthController {
  /**
   * Register a new user
   */
  public static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const signUpData = await validateDto(signUpSchema, req.body);

      // Check if user already exists
      const existingUser = await UserService.findUser({ email: signUpData.email });
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }

      // Create user
      const user = await UserService.createUser({
        data: signUpData
      });

      // Generate tokens
      const tokens = await jwtService.generateTokens(user);

      res.status(201).json({
        user: new UserResponseDto(user),
        tokens
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Login existing user
   */
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData = await validateDto(loginSchema, req.body);

      // Find user by email
      const user = await UserService.findUser({ email: loginData.email });
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password!', 401);
      }

      // Generate tokens
      const tokens = await jwtService.generateTokens(user);

      res.json({
        user: new UserResponseDto(user),
        tokens
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Refresh access token
   */
  public static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      const tokens = await jwtService.refreshTokens(refreshToken);
      res.json(tokens);
    } catch (err) {
      next(err);
    }
  }
}