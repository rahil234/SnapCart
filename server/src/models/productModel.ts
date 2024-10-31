import mongoose, { Schema } from 'mongoose';
import { Product } from 'shared/types';

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  stock: { type: Number, required: true },
  images: { type: Array, required: true },
  status: { type: String, default: 'Active' },
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
});

const productModel = mongoose.model<Product>('Product', ProductSchema);

export default productModel;
