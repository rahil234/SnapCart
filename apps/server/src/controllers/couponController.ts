import { Request, Response } from 'express';
import couponModal from '@/models/couponModel';

const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await couponModal.find();
    res.status(200).json(coupons);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get coupons' });
  }
};

const applyCoupon = async (req: Request, res: Response) => {
  try {
    const { coupon } = req.body;
    console.log(coupon);
    const couponDoc = await couponModal.findOne({ code: coupon });

    if (!couponDoc) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }

    const currentDate = new Date();
    console.log(couponDoc.startDate, currentDate, couponDoc.endDate);
    if (
      couponDoc.status !== 'Active' ||
      couponDoc.startDate > currentDate ||
      couponDoc.endDate < currentDate
    ) {
      res.status(400).json({ message: 'Coupon is not valid at this time' });
      return;
    }

    res.status(200).json({ message: 'Coupon applied', coupon: couponDoc });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discount, minAmount, maxDiscount, type, startDate, endDate } =
      req.body;

    const parseDate = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    const newCoupon = new couponModal({
      code,
      discount,
      type,
      minAmount,
      maxDiscount,
      startDate: parseDate(startDate),
      endDate: parseDate(endDate),
    });

    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

const updateCoupon = async (req: Request, res: Response) => {
  try {
    const updatedCoupon = await couponModal.findByIdAndUpdate(
      req.params.couponId,
      req.body,
      { new: true }
    );
    if (!updatedCoupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }
    res.status(200).json(updatedCoupon);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};

const getAvailableCoupons = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const coupons = await couponModal.find({
      status: 'Active',
      applicableTo: 'All',
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      limit: { $gt: 0 },
    });
    res.status(200).json(coupons);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get available coupons' });
  }
};

export default {
  getAllCoupons,
  applyCoupon,
  createCoupon,
  updateCoupon,
  getAvailableCoupons,
};
