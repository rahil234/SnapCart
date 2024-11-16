import { Router } from 'express';
import orderController from '@/controllers/orderController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';

const router = Router();

router.get(
  '/admin',
  authenticateAndAuthorize(['admin']),
  orderController.getAdminOrders
);

router.get(
  '/seller',
  authenticateAndAuthorize(['seller']),
  orderController.getSellerOrders
);

router.get(
  '/verify-checkout',
  authenticateAndAuthorize(['customer']),
  orderController.verifyCheckout
);

router.post(
  '/create-payment',
  authenticateAndAuthorize(['customer']),
  orderController.createPayment
);

router.post(
  '/verify-payment',
  authenticateAndAuthorize(['customer']),
  orderController.verifyPayment
);

router.delete(
  '/:orderId/items/:itemId',
  authenticateAndAuthorize(['customer']),
  orderController.cancelOrderItem
);

router.get(
  '/:orderId',
  authenticateAndAuthorize(['customer']),
  orderController.getOrder
);

router.get(
  '/',
  authenticateAndAuthorize(['customer']),
  orderController.getOrders
);

router.post(
  '/',
  authenticateAndAuthorize(['customer']),
  orderController.createOrder
);

export default router;
