import { Router, Response, Request } from 'express';
import user from '../controllers/userController';
const userRoute = Router();

userRoute.get('/', user.login);

export default userRoute;
