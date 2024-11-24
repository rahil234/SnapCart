import { Router } from 'express';
import salesController from '@/controllers/salesController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';

const router = Router();

router.get(
  '/',
  authenticateAndAuthorize(['seller']),
  salesController.fetchSalesReport
);

export default router;
