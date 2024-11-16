import { Router } from 'express';
import couponController from '../controllers/couponController';

const router = Router();

router.get('/', couponController.getAllCoupons);

router.post('/apply', couponController.applyCoupon);

router.post('/', couponController.createCoupon);

router.put('/:couponId', couponController.updateCoupon);

export default router;
