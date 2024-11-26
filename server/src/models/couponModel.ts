import { Schema, model, Document } from 'mongoose';

interface ICoupon extends Document {
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  type: 'percentage' | 'fixed';
  status: 'Active' | 'Inactive';
  minAmount: number;
  maxDiscount: number;
  products: string[];
  categories: string[];
  subCategories: string[];
}

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
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    subCategories: [{ type: Schema.Types.ObjectId, ref: 'Subcategory' }],
  },
  {
    timestamps: true,
  }
);

const Coupon = model<ICoupon>('Coupon', couponSchema);

export default Coupon;
