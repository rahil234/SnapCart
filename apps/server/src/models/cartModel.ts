import mongoose, { Schema } from 'mongoose';
import { ICart } from '@snapcart/shared/types';

const CartSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 0 },
      },
    ],
    totalAmount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    index: { userId: 1 },
  }
);

const cartModel = mongoose.model<ICart>('Cart', CartSchema);

export default cartModel;
