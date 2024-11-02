import { Router } from 'express';
import cartController from '../controllers/cartController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';

const cartRoute = Router();

cartRoute.get(
  '/',
  authenticateAndAuthorize(['customer']),
  cartController.getCart
);

cartRoute.post(
  '/',
  authenticateAndAuthorize(['customer']),
  cartController.addItem
);

cartRoute.delete(
  '/:productId',
  authenticateAndAuthorize(['customer']),
  cartController.removeItem
);

export default cartRoute;
