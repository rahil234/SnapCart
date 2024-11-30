import { Schema, model, Document } from 'mongoose';

interface IOffer extends Document {
  title: string;
  type: 'Percentage' | 'Fixed';
  description: string;
  discount: number;
  minPrice: number;
  startDate: Date;
  expiryDate: Date;
  products: string[];
  categories: string[];
  validUntil: Date;
  status: string;
  limit: number;
}

const offerSchema = new Schema<IOffer>(
  {
    title: { type: String, validate: /^[a-zA-Z0-9\s]*$/ },
    type: { type: String },
    discount: { type: Number },
    minPrice: { type: Number },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    startDate: {
      type: Date,
    },
    description: { type: String, validate: /^[a-zA-Z0-9\s]*$/ },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,

      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    limit: { type: Number },
  },
  {
    timestamps: true,
  }
);
const Offer = model<IOffer>('Offer', offerSchema);

export default Offer;
