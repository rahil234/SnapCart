import { Router } from 'express';
import authController from '@/controllers/authController';

const authRoute = Router();

authRoute.post('/refresh-token', authController.refreshToken);

authRoute.post('/logout', authController.logout);

export default authRoute;
