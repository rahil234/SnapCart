import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  status: string;
  soldCount: number;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, default: 'Active' },
  soldCount: { type: Number, default: 0 },
});

const categoryModel = mongoose.model<ICategory>('Category', CategorySchema);

export default categoryModel;
