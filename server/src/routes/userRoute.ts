import { Router } from 'express';
import user from '../controllers/userController';
const userRoute = Router();

userRoute.get('/login', user.login);

userRoute.get('/signup', user.signup);

userRoute.get('/products', user.getProducts);

export default userRoute;
