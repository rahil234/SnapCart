import mongoose, { Schema, Document } from 'mongoose';

interface ISubCategory extends Document {
  name: string;
  status: string;
  category: mongoose.Schema.Types.ObjectId;
  soldCount: number;
}

const SubCategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, default: 'Active' },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  soldCount: { type: Number, default: 0 },
});

const subcategoryModel = mongoose.model<ISubCategory>(
  'Subcategory',
  SubCategorySchema
);

export default subcategoryModel;
