import { Router } from 'express';
import userController from '../controllers/userController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import upload from '@/middleware/upload';

const userRoute = Router();

userRoute.post('/login', userController.login);

userRoute.post('/google-login', userController.googleLogin);

userRoute.post('/signup', userController.signup);

userRoute.get('/products', userController.getProducts);

userRoute.get('/product/:productId', userController.getProduct);

userRoute.post('/send-otp', userController.verifySignUp);

userRoute.post('/verify-otp', userController.verifyOtp);

userRoute.post('/forgot-password', userController.forgotPassword);

userRoute.post(
  '/upload-profile-picture',
  authenticateAndAuthorize(['customer']),
  upload.single('file'),
  userController.uploadProfilePicture
);

userRoute.patch('/:userId/block', userController.blockUser);

userRoute.patch('/:userId/allow', userController.allowUser);

userRoute.get(
  '/shopping-cart',
  authenticateAndAuthorize(['customer']),
  userController.getCart
);

userRoute.post(
  '/shopping-cart',
  authenticateAndAuthorize(['customer']),
  userController.addToCart
);

export default userRoute;
