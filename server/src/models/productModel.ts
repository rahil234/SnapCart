import mongoose, { Schema } from 'mongoose';
import { Product } from '@shared/types';

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  stock: { type: Number, required: true },
  images: { type: Array, required: true },
  status: { type: String, default: 'Active' },
  reviews: { type: Array, default: [] },
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
});

const productModel = mongoose.model<Product>('Product', ProductSchema);

export default productModel;
