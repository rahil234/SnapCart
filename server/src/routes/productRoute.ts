import { Router } from 'express';
import productController from '@/controllers/productController';
import upload from '@/middleware/upload';

const productRoute = Router();

productRoute.post('/add-product', upload.any(), productController.addProduct);

productRoute.patch(
  '/edit-product',
  upload.array('images', 8),
  productController.editProduct
);

productRoute.get(
  '/related-products/:subcategoryId',
  productController.getRelatedProducts
);

productRoute.patch(
  '/unlist-product/:productId',
  productController.unlistProduct
);

productRoute.patch('/list-product/:productId', productController.listProduct);

export default productRoute;
