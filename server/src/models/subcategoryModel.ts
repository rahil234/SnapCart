import mongoose, { Schema, Document } from 'mongoose';

interface ISubcategory extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
}

const SubcategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

const subcategoryModel = mongoose.model<ISubcategory>(
  'Subcategory',
  SubcategorySchema
);

export default subcategoryModel;
