import { Router } from 'express';
import {
  adminLogin,
  editCategories,
  getCategories,
  addProduct,
} from '../controllers/adminController';

const adminRoute = Router();

adminRoute.post('/login', adminLogin);

adminRoute.get('/get-categories', getCategories);

adminRoute.patch('/edit-categories', editCategories);

adminRoute.post('/add-product', addProduct);

export default adminRoute;
