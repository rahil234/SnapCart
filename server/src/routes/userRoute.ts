import { Router } from 'express';
import userController from '../controllers/userController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import upload from '@/middleware/upload';

const userRoute = Router();

userRoute.post('/login', userController.login);

userRoute.post('/google-login', userController.googleLogin);

userRoute.post('/signup', userController.signup);

userRoute.post(
  '/send-otp',
  authenticateAndAuthorize(['customer']),
  userController.verifySignUp
);

userRoute.post('/verify-otp', userController.verifyOtp);

userRoute.post('/forgot-password', userController.forgotPassword);

userRoute.post('/reset-password', userController.resetPassword);

userRoute.post(
  '/upload-profile-picture',
  authenticateAndAuthorize(['customer']),
  upload.single('file'),
  userController.uploadProfilePicture
);

userRoute.patch(
  '/update-profile',
  authenticateAndAuthorize(['customer']),
  userController.updateProfile
);

userRoute.patch(
  '/:userId/block',
  authenticateAndAuthorize(['admin']),
  userController.blockUser
);

userRoute.patch(
  '/:userId/allow',
  authenticateAndAuthorize(['admin']),
  userController.allowUser
);

userRoute.post(
  '/add-address',
  authenticateAndAuthorize(['customer']),
  userController.addAddress
);

export default userRoute;
