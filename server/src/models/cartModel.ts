import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
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
