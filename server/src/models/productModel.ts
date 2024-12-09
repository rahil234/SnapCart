import mongoose, { Schema } from 'mongoose';
import { Product } from 'shared/types';

const ProductSchema: Schema = new Schema(
  {
    variantId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    variantName: { type: String, required: true },
    stock: { type: Number, required: true },
    images: { type: Array, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    description: { type: String },
    reviews: {
      type: Array,
      default: [
        {
          user: 'user',
          comment: 'demo review',
          rating: 4,
        },
        {
          user: 'user2',
          comment: 'demo review',
          rating: 2,
        },
      ],
    },
    ratings: { type: Number, default: 5 },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    subcategory: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Subcategory',
    },
    seller: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Seller',
    },
    offer: {
      type: mongoose.Types.ObjectId,
      ref: 'Offer',
    },
    soldCount: { type: Number, default: 0 },
    offerPrice: { type: Number },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model<Product>('Product', ProductSchema);

export default productModel;
