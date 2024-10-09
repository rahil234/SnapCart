import { Router } from 'express';
import user from '../controllers/userController';

const userRoute = Router();

userRoute.post('/login', user.login);

userRoute.post('/signup', user.signup);

userRoute.get('/products', user.getProducts);

userRoute.get('/products/:productId', user.getProduct);

userRoute.get('/send-otp', user.sendOtp);

userRoute.post('/verify-otp', user.verifyOtp);

export default userRoute;
