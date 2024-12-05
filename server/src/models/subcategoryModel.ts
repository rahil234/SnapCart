import mongoose, { Schema, Document } from 'mongoose';
import { Subcategory } from '@shared/types';

const SubCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    status: { type: String, default: 'Active' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    soldCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const subcategoryModel = mongoose.model<Subcategory & Document>(
  'Subcategory',
  SubCategorySchema
);

export default subcategoryModel;
