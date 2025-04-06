import * as yup from 'yup';
import { User, UserDocument } from '@src/interfaces/mongoose.gen';
import { attachCompanySchema, createUserSchema, paginationParamsSchema, updateUserSchema } from './user.validation';


export type CreateUserDto  = yup.InferType<typeof createUserSchema>;

export type UpdateUserDto  = yup.InferType<typeof updateUserSchema>;


export type AttachCompanyDto  = yup.InferType<typeof attachCompanySchema>;

export type PaginationParamsDto  = yup.InferType<typeof paginationParamsSchema>;


export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companies: string[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(user: User | UserDocument) {
    this.id = user._id.toString();
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.companies = user.companies.map((c: any) => (c?._id||c).toString());
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
