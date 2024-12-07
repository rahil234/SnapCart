import { Request, Response } from 'express';
import offerModal from '@models/offerModel';

const getOffers = async (_req: Request, res: Response) => {
  try {
    const offers = await offerModal.find();
    res.status(200).json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get offers' });
  }
};

const addOffer = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const newOffer = new offerModal({ ...req.body });
    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to add offer' });
  }
};

const updateOffer = async (req: Request, res: Response) => {
  try {
    const { offerId } = req.params;

    if (!offerId) {
      res.status(400).json({ error: 'Offer ID is required' });
      return;
    }

    const updatedOffer = await offerModal.findByIdAndUpdate(offerId, req.body, {
      new: true,
    });
    if (!updatedOffer) {
      res.status(404).json({ error: 'Offer not found' });
      return;
    }
    res.status(200).json(updatedOffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update offer' });
  }
};

export default { getOffers, updateOffer, addOffer };
