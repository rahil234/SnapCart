import express from 'express';
import productController from '@/controllers/productController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import upload from '@/middleware/upload';

const productRoute = express.Router();

productRoute.post(
  '/add-product',
  authenticateAndAuthorize(['seller']),
  upload.any(),
  productController.addProduct
);

productRoute.patch(
  '/edit-product',
  upload.array('images', 8),
  productController.editProduct
);

productRoute.get(
  '/related-products/:productId',
  productController.getRelatedProducts
);

productRoute.get(
  '/get-admin-products',
  authenticateAndAuthorize(['admin']),
  productController.getProductsByAdmin
);

productRoute.get(
  '/get-seller-products',
  authenticateAndAuthorize(['seller']),
  productController.getProductsBySeller
);

productRoute.patch(
  '/unlist-product/:productId',
  productController.unlistProduct
);

productRoute.patch('/list-product/:productId', productController.listProduct);

export default productRoute;
