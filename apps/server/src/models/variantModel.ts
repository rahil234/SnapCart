import mongoose, { Schema, Document } from 'mongoose';

export interface IVariant extends Document {
  productId: Schema.Types.ObjectId;
  variantName: string;
  price: number;
  offerPrice?: number;
  stock: number;
  images: string[];
  soldCount: number;
  status: 'Active' | 'Inactive';
}

const VariantSchema = new Schema<IVariant>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },

    variantName: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: Number,
    stock: { type: Number, required: true },
    images: { type: [String], required: true },

    soldCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVariant>('Variant', VariantSchema);
