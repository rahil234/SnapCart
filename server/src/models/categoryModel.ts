import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  // subcategories: mongoose.Types.ObjectId[];
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  // subcategories: [{ type: mongoose.Types.ObjectId, ref: 'Subcategory' }],
});

const categoryModel = mongoose.model<ICategory>('Category', CategorySchema);

export default categoryModel;
