import mongoose, { Schema } from 'mongoose';
import { Product } from '@snapcart/shared/types';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },

    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Variant',
      },
    ],

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

export default mongoose.model<Product>('Product', ProductSchema);
