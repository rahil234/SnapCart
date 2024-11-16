import { Router } from 'express';
import salesController from '@/controllers/salesController';

const router = Router();

router.get('/', salesController.fetchSalesReport);

export default router;
