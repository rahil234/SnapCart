import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  id: string;
  name: string;
  price: number;
  quantity: string;
  image: string;
  categoryId: mongoose.Types.ObjectId;
  subcategoryId: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  images: { type: Array, required: true },
  // categoryId: {
  //   type: mongoose.Types.ObjectId,
  //   required: true,
  //   ref: 'categories',
  // },
  // subcategoryId: {
  //   type: mongoose.Types.ObjectId,
  //   required: true,
  //   refPath: 'categoryId.subcategories',
  // },
});

const productModel = mongoose.model<IProduct>('Product', ProductSchema);

export default productModel;
