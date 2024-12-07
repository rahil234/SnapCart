import express from 'express';
import productController from '@/controllers/productController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import upload from '@/middleware/productUpload';

const router = express.Router();

router.get(
  '/seller',
  authenticateAndAuthorize(['seller']),
  productController.getProductsBySeller
);

router.get(
  '/admin',
  authenticateAndAuthorize(['admin']),
  productController.getProductsByAdmin
);

router.post(
  '/add-product',
  authenticateAndAuthorize(['seller']),
  upload.any(),
  productController.addProduct
);

router.patch(
  '/edit-product',
  upload.array('images', 7),
  authenticateAndAuthorize(['seller']),
  productController.editProduct
);

router.get(
  '/topProduct',
  authenticateAndAuthorize(['admin', 'seller']),
  productController.getTopProducts
);

router.patch(
  '/list-product/:productId',
  authenticateAndAuthorize(['admin', 'seller']),
  productController.listProduct
);

router.patch(
  '/un-list-product/:productId',
  authenticateAndAuthorize(['admin', 'seller']),
  productController.unListProduct
);

router.get(
  '/related-products/:productId',
  productController.getRelatedProducts
);

router.get('/category/:category', productController.getProductByCategory);

router.get('/search', productController.searchProducts);

router.get('/:productId', productController.getProduct);

router.get('', productController.getProductsByUser);

export default router;
