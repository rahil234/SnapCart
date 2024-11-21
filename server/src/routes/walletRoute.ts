import { Router } from 'express';
import walletController from '@/controllers/walletController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';

const router = Router();

router.get(
  '/',
  authenticateAndAuthorize(['customer']),
  walletController.getBalance
);

router.get(
  '/transactions',
  authenticateAndAuthorize(['customer']),
  walletController.getTransaction
);

router.post(
  '/add-funds',
  authenticateAndAuthorize(['customer']),
  walletController.getTransaction
);

export default router;
