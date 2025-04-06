// src/routes/user.routes.ts
import express from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '@src/web/middlewares/auth';
import { asyncHandler } from '@src/web/middlewares/asyncHandler';

const router = express.Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', asyncHandler(UserController.getSelf));

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get paginated users list
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: populateCompanies
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Paginated users list
 *       401:
 *         description: Unauthorized
 */
router.get('/', asyncHandler(UserController.getUsers));

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', asyncHandler(UserController.getById));

/**
 * @openapi
 * /api/users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Update current user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch('/me', asyncHandler(UserController.updateUser));

/**
 * @openapi
 * /api/users/me/companies:
 *   post:
 *     tags: [Users]
 *     summary: Attach company to user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttachCompanyDto'
 *     responses:
 *       200:
 *         description: Company attached successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/me/companies', asyncHandler(UserController.attachCompany));

/**
 * @openapi
 * /api/users/me:
 *   delete:
 *     tags: [Users]
 *     summary: Delete current user (soft delete)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/me', asyncHandler(UserController.deleteUser));

export default router;