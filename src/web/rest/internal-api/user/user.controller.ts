// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../../../services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  AttachCompanyDto,
  PaginationParamsDto,
  UserResponseDto,
  } from './user.dto';
import {
  createUserSchema,
  updateUserSchema,
  attachCompanySchema,
  paginationParamsSchema
} from './user.validation'
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError } from '@src/helpers/AppError';
import { TypedRequest } from '@src/types/web';
import { validateDto } from '@src/helpers/validateRequest';

export class UserController {
  public static async getById(req: TypedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.findUser({ id });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json(new UserResponseDto(user));
    } catch (err) {
      next(err);
    }
  }

  public static async getSelf(req: TypedRequest, res: Response, next: NextFunction) {
    try {
      // Assuming you have middleware that sets req.user from JWT or session
      const userId = req.user.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await UserService.findUser({ id: userId });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json(new UserResponseDto(user));
    } catch (err) {
      next(err);
    }
  }

  public static async getUsers(req: TypedRequest, res: Response, next: NextFunction) {
    try {
      const paginationParams = await validateDto(paginationParamsSchema, req.query);

      const users = await UserService.listUsers({
        filter: paginationParams.search ? { 
          $or: [
            { firstName: { $regex: paginationParams.search, $options: 'i' } },
            { lastName: { $regex: paginationParams.search, $options: 'i' } },
            { email: { $regex: paginationParams.search, $options: 'i' } }
          ]
        } : {},
        page: paginationParams.page,
        limit: paginationParams.limit,
        populateCompanies: paginationParams.populateCompanies
      });

      res.json({
        ...users,
        docs: users.docs.map(user => new UserResponseDto(user))
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateUser(req: TypedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const data: UpdateUserDto = await validateDto<UpdateUserDto>(updateUserSchema, req.body);

      const user = await UserService.updateUser({
        id: userId,
        data
      });

      res.json(new UserResponseDto(user));
    } catch (err) {
      next(err);
    }
  }

  public static async attachCompany(req: TypedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const data: AttachCompanyDto = await validateDto<AttachCompanyDto>(attachCompanySchema, req.body);

      const user = await UserService.attachCompany({
        id: userId,
        data: { companyId: data.companyId }
      });

      res.json(new UserResponseDto(user));
    } catch (err) {
      next(err);
    }
  }

  public static async deleteUser(req: TypedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      await UserService.deleteUser({ id: userId });
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}