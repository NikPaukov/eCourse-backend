import * as yup from 'yup';

export async function validateDto<T>(schema: yup.Schema<T>, data: any): Promise<T> {
    return schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });
  }