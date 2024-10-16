import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  id: string;
  name: string;
  price: number;
  quantity: string;
  stock: number;
  image: string;
  category: mongoose.Types.ObjectId;
  subcategory: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  stock: { type: Number, required: true },
  images: { type: Array, required: true },
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

const productModel = mongoose.model<IProduct>('Product', ProductSchema);

export default productModel;
