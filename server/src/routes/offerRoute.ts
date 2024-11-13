import express from 'express';
import offerController from '@/controllers/offerController';

const router = express.Router();

router.get('/', offerController.getOffers);

router.post('/', offerController.addOffer);

router.put('/', offerController.updateOffer);

export default router;
