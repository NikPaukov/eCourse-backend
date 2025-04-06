import { Router } from 'express';
import authRouter from './rest/internal-api/auth/auth.router'
import userRouter from './rest/internal-api/user/user.router'
const router = Router();


// router.use('/public', publicRouter);
// router.use('/internal', cognitoAuthorizer, internalRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
export default router;
