import express from 'express';
import { AuthController } from './auth.controller';
import { asyncHandler } from '@src/web/middlewares/asyncHandler';

const router = express.Router();

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or email already in use
 */
router.post('/signup', asyncHandler(AuthController.signUp));

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', asyncHandler(AuthController.login));

/**
 * @openapi
 * /api/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *       400:
 *         description: Refresh token missing or invalid
 */
router.post('/refresh-token', asyncHandler(AuthController.refreshToken));

export default router;