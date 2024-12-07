import express from 'express';
import offerController from '@/controllers/offerController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';

const router = express.Router();

router.get('/', authenticateAndAuthorize(['admin']), offerController.getOffers);

router.post('/', authenticateAndAuthorize(['admin']), offerController.addOffer);

router.put(
  '/:offerId',
  authenticateAndAuthorize(['admin']),
  offerController.updateOffer
);

export default router;
