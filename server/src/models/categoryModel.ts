import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  status: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, default: 'Active' },
});

const categoryModel = mongoose.model<ICategory>('Category', CategorySchema);

export default categoryModel;
