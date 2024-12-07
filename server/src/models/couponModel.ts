import { Schema, model } from 'mongoose';
import { ICoupon } from '@shared/types';

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    minAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    applicableTo: {
      type: String,
      enum: ['All', 'New', 'Existing', 'Exclusive'],
      default: 'All',
    },
    limit: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

const Coupon = model<ICoupon>('Coupon', couponSchema);

export default Coupon;
