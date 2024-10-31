import mongoose, { Schema } from 'mongoose';

export interface ICart extends Document {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  totalPrice: number;
}

const CartSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model<ICart>('Cart', CartSchema);

export default cartModel;
