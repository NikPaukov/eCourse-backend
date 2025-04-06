import * as yup from 'yup';
import { User, UserDocument } from '@src/interfaces/mongoose.gen';

export const createUserSchema: yup.Schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase, one lowercase, one number and one special character'
    )
    .required('Password is required')
}).required();

export const updateUserSchema: yup.Schema = yup.object({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  email: yup.string().email('Invalid email format').optional()
}).test(
  'at-least-one-field',
  'At least one field must be provided',
  value => !!(value.firstName || value.lastName || value.email)
).optional();

export const attachCompanySchema: yup.Schema = yup.object({
  companyId: yup.string()
    .defined('Company ID is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid company ID format')
}).required();
export const paginationParamsSchema = yup.object().shape({
  page: yup.number()
    .min(1, 'Page must be at least 1')
    .default(1)
    .optional(),
  limit: yup.number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10)
    .optional(),
  search: yup.string().optional(),
  populateCompanies: yup.boolean().default(false).optional()
});
