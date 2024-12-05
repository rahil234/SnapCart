import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '@shared/types';

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    status: { type: String, default: 'Active' },
    soldCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const categoryModel = mongoose.model<Category & Document>(
  'Category',
  CategorySchema
);

export default categoryModel;
