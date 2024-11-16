import { Schema, model, Document } from 'mongoose';

interface ICoupon extends Document {
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  type: 'percentage' | 'fixed';
  status: 'Active' | 'Inactive';
  products: string[];
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
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  }
);

const Coupon = model<ICoupon>('Coupon', couponSchema);

export default Coupon;
