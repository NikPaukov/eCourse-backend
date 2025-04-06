import { loginSchema, signUpSchema } from "./auth.validation";
import * as yup from 'yup';


export type SignUpDto = yup.InferType<typeof signUpSchema>;
export type LoginDto = yup.InferType<typeof loginSchema>;