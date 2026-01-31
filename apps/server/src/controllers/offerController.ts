import { Request, Response } from 'express';
import offerModal from '@/models/offerModel';
import productModal from '@/models/productModel';
import { Types } from 'mongoose';

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
    const { categories, products } = req.body;

    const newOffer = new offerModal({
      ...req.body,
      categories: categories ? [categories] : [],
      products: products ? [products] : [],
    });

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

const getProductApplicableOffers = async (req: Request, res: Response) => {
  try {
    const productId = new Types.ObjectId(req.params.productId);
    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    const categoryId = (await productModal.findById(productId))?.category;

    console.log('product category', categoryId);

    const offers = await offerModal.find({
      $or: [
        { products: { $in: [productId] } },
        { categories: { $in: [categoryId] } },
      ],
    });

    console.log('product applicable offers', offers);
    res.status(200).json(offers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get offers' });
  }
};

export default { getOffers, updateOffer, addOffer, getProductApplicableOffers };
