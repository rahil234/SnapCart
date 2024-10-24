import { Router } from 'express';
import user from '../controllers/userController';

const userRoute = Router();

userRoute.post('/login', user.login);

userRoute.post('/google-login', user.googleLogin);

userRoute.post('/signup', user.signup);

userRoute.get('/products', user.getProducts);

userRoute.get('/product/:productId', user.getProduct);

userRoute.post('/send-otp', user.verifySignUp);

userRoute.post('/verify-otp', user.verifyOtp);

userRoute.post('/forgot-password', user.forgotPassword);

userRoute.patch('/:userId/block', user.blockUser);

userRoute.patch('/:userId/allow', user.allowUser);

export default userRoute;
