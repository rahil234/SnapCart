import express from 'express';
import productController from '@/controllers/productController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import upload from '@/middleware/upload';

const router = express.Router();

router.get(
  '/related-products/:productId',
  productController.getRelatedProducts
);

router.get('/category/:category', productController.getProductByCategory);

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
  upload.array('images', 8),
  productController.editProduct
);

router.get('/topProduct', productController.getTopProducts);

router.patch('/unlist-product/:productId', productController.unListProduct);

router.patch('/list-product/:productId', productController.listProduct);

router.get('/search', productController.searchProducts);

router.get('/:productId', productController.getProduct);

router.get('', productController.getProductsByUser);

export default router;
