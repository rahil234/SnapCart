import { Router } from 'express';
import walletController from '@/controllers/walletController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';

const router = Router();

router.get(
  '/',
  authenticateAndAuthorize(['customer']),
  walletController.getBalance
);

router.get('/transactions', walletController.getTransaction);

router.post('/add-funds', walletController.getTransaction);

export default router;
