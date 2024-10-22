import { Router } from 'express';
import productController from '@/controllers/productController';
import upload from '@/middleware/upload';

const productRoute = Router();

productRoute.post(
  '/add-product',
  upload.array('images'),
  productController.addProduct
);

productRoute.patch(
  '/edit-product',
  upload.array('images', 8),
  productController.editProduct
);

export default productRoute;
