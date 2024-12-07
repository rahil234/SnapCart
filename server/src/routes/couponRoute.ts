import { Router } from 'express';
import couponController from '../controllers/couponController';

const router = Router();

router.post('/apply', couponController.applyCoupon);

router.put('/:couponId', couponController.updateCoupon);

router.post('/', couponController.createCoupon);

router.get('/available', couponController.getAvailableCoupons);

router.get('/', couponController.getAllCoupons);

export default router;
