import { Router } from 'express';
import upload from '../middleware/upload';
import {
  adminLogin,
  editCategories,
  addCategory,
  getCategories,
  addProduct,
  getProducts,
  getUsers,
} from '../controllers/adminController';

const adminRoute = Router();

adminRoute.post('/login', adminLogin);

adminRoute.get('/get-categories', getCategories);

adminRoute.post('/add-category', addCategory);

adminRoute.patch('/edit-categories', editCategories);

adminRoute.get('/get-products', getProducts);

adminRoute.post('/upload', upload.array('images', 10), addProduct);

adminRoute.post('/add-product', upload.array('images', 6), addProduct);

adminRoute.get('/get-users', getUsers);

export default adminRoute;
